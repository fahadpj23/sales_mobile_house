import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchSalesData } from "../../store/salesSlice";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { salesData } = useAppSelector((state) => state.sales);
  const [expandedShop, setExpandedShop] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    dispatch(fetchSalesData());
  }, [dispatch]);

  // Filter data based on selected time range
  const filteredData = salesData.filter((sale) => {
    const saleDate = new Date(sale.date);
    const currentDate = new Date(selectedDate);

    switch (timeRange) {
      case "day":
        return sale.date === selectedDate;
      case "week":
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return saleDate >= weekStart && saleDate <= weekEnd;
      case "month":
        return (
          saleDate.getMonth() === currentDate.getMonth() &&
          saleDate.getFullYear() === currentDate.getFullYear()
        );
      default:
        return true;
    }
  });

  // Calculate shop performance with price tracking
  const shopPerformance = filteredData.reduce((acc, sale) => {
    if (!acc[sale.shop]) {
      acc[sale.shop] = {
        totalSales: 0,
        totalService: 0,
        totalRevenue: 0,
        keypadPhones: 0,
        smartphones: 0,
        keypadModels: {},
        smartphoneModels: {},
        keypadValue: 0, // NEW: Total value of keypad phones
        smartphoneValue: 0, // NEW: Total value of smartphones
        dailyData: {},
      };
    }

    const salesTotal = parseFloat(sale.salesTotal.toString()) || 0;
    const serviceTotal = parseFloat(sale.serviceTotal.toString()) || 0;

    // Calculate phone values
    const keypadValue =
      sale.keypadModels?.reduce(
        (sum, model) => sum + (model.price || 0) * (model.count || 1),
        0
      ) || 0;
    const smartphoneValue =
      sale.smartphoneModels?.reduce(
        (sum, model) => sum + (model.price || 0) * (model.count || 1),
        0
      ) || 0;
    const phoneRevenue = keypadValue + smartphoneValue;

    acc[sale.shop].totalSales += salesTotal;
    acc[sale.shop].totalService += serviceTotal;
    acc[sale.shop].totalRevenue += salesTotal + serviceTotal + phoneRevenue;
    acc[sale.shop].keypadPhones += sale.keypadPhones || 0;
    acc[sale.shop].smartphones += sale.smartphones || 0;
    acc[sale.shop].keypadValue += keypadValue; // NEW: Accumulate keypad value
    acc[sale.shop].smartphoneValue += smartphoneValue; // NEW: Accumulate smartphone value

    // Track model counts
    sale.keypadModels?.forEach((model) => {
      if (model.name) {
        acc[sale.shop].keypadModels[model.name] =
          (acc[sale.shop].keypadModels[model.name] || 0) + (model.count || 1);
      }
    });

    sale.smartphoneModels?.forEach((model) => {
      if (model.name) {
        acc[sale.shop].smartphoneModels[model.name] =
          (acc[sale.shop].smartphoneModels[model.name] || 0) +
          (model.count || 1);
      }
    });

    // Track daily data for charts
    if (!acc[sale.shop].dailyData[sale.date]) {
      acc[sale.shop].dailyData[sale.date] = {
        sales: 0,
        service: 0,
        revenue: 0,
        keypadPhones: 0,
        smartphones: 0,
      };
    }

    acc[sale.shop].dailyData[sale.date].sales += salesTotal;
    acc[sale.shop].dailyData[sale.date].service += serviceTotal;
    acc[sale.shop].dailyData[sale.date].revenue +=
      salesTotal + serviceTotal + phoneRevenue;
    acc[sale.shop].dailyData[sale.date].keypadPhones += sale.keypadPhones || 0;
    acc[sale.shop].dailyData[sale.date].smartphones += sale.smartphones || 0;

    return acc;
  }, {} as Record<string, any>);

  // Calculate totals across all shops with price values
  const totals = Object.values(shopPerformance).reduce(
    (acc, shop) => ({
      totalRevenue: acc.totalRevenue + shop.totalRevenue,
      totalSales: acc.totalSales + shop.totalSales,
      totalService: acc.totalService + shop.totalService,
      totalKeypadPhones: acc.totalKeypadPhones + shop.keypadPhones,
      totalSmartphones: acc.totalSmartphones + shop.smartphones,
      totalKeypadValue: acc.totalKeypadValue + (shop.keypadValue || 0), // NEW
      totalSmartphoneValue:
        acc.totalSmartphoneValue + (shop.smartphoneValue || 0), // NEW
      totalPhoneValue:
        acc.totalPhoneValue +
        (shop.keypadValue || 0) +
        (shop.smartphoneValue || 0), // NEW
    }),
    {
      totalRevenue: 0,
      totalSales: 0,
      totalService: 0,
      totalKeypadPhones: 0,
      totalSmartphones: 0,
      totalKeypadValue: 0, // NEW
      totalSmartphoneValue: 0, // NEW
      totalPhoneValue: 0, // NEW
    }
  );

  const toggleExpand = (shop: string) => {
    setExpandedShop(expandedShop === shop ? null : shop);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Sales Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange("day")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                timeRange === "day"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setTimeRange("week")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                timeRange === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                timeRange === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Month
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Revenue Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Revenue
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                ₹{totals.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">All income</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-lg sm:text-xl">💰</span>
            </div>
          </div>
        </div>

        {/* Sales Total Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Sales Total
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                ₹{totals.totalSales.toFixed(2)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-lg sm:text-xl">🛒</span>
            </div>
          </div>
        </div>

        {/* Service Total Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Service Total
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                ₹{totals.totalService.toFixed(2)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-lg sm:text-xl">🔧</span>
            </div>
          </div>
        </div>

        {/* Total Phones Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Phones
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {totals.totalKeypadPhones + totals.totalSmartphones}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ₹{Math.ceil(totals.totalPhoneValue)} value
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg">
              <span className="text-indigo-600 text-lg sm:text-xl">📱</span>
            </div>
          </div>
        </div>

        {/* Keypad Phones Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Keypad
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {totals.totalKeypadPhones}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ₹₹{Math.ceil(totals.totalKeypadValue)} value
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
              <span className="text-orange-600 text-lg sm:text-xl">⌨️</span>
            </div>
          </div>
        </div>

        {/* Smartphones Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Smart
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {totals.totalSmartphones}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ₹₹{Math.ceil(totals.totalSmartphoneValue)} value
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-pink-100 rounded-lg">
              <span className="text-pink-600 text-lg sm:text-xl">📲</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Performance */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Shop Performance
        </h2>

        {Object.entries(shopPerformance).map(([shop, data]) => (
          <div
            key={shop}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Shop Header */}
            <div
              className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(shop)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {shop}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                      {data.keypadPhones} keypad (₹{data.keypadValue.toFixed(2)}
                      )
                    </span>
                    <span className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      {data.smartphones} smart (₹
                      {data.smartphoneValue.toFixed(2)})
                    </span>
                    <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      ₹{data.totalRevenue.toFixed(2)} total
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:space-x-4 w-full sm:w-auto">
                  <div className="flex space-x-3 sm:space-x-4">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600">Sales</p>
                      <p className="font-semibold text-green-600 text-sm sm:text-base">
                        ₹{data.totalSales.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Service
                      </p>
                      <p className="font-semibold text-blue-600 text-sm sm:text-base">
                        ₹{data.totalService.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="transform transition-transform ml-2">
                    <span className="text-xl sm:text-2xl">
                      {expandedShop === shop ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedShop === shop && (
              <div className="border-t border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Phone Models Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Keypad Phones */}
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                      Keypad Phones (₹{data.keypadValue.toFixed(2)})
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(data.keypadModels).map(
                        ([model, count]) => (
                          <div
                            key={model}
                            className="flex justify-between items-center py-1"
                          >
                            <span className="text-gray-700 text-sm sm:text-base">
                              {model}
                            </span>
                            <span className="font-semibold bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs sm:text-sm">
                              {count as number}
                            </span>
                          </div>
                        )
                      )}
                      {Object.keys(data.keypadModels).length === 0 && (
                        <p className="text-gray-500 text-xs sm:text-sm">
                          No keypad phones sold
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Smartphones */}
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                      Smartphones (₹{data.smartphoneValue.toFixed(2)})
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(data.smartphoneModels).map(
                        ([model, count]) => (
                          <div
                            key={model}
                            className="flex justify-between items-center py-1"
                          >
                            <span className="text-gray-700 text-sm sm:text-base">
                              {model}
                            </span>
                            <span className="font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs sm:text-sm">
                              {count as number}
                            </span>
                          </div>
                        )
                      )}
                      {Object.keys(data.smartphoneModels).length === 0 && (
                        <p className="text-gray-500 text-xs sm:text-sm">
                          No smartphones sold
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Simple Bar Chart using CSS */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                    Sales Trend
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(data.dailyData)
                      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                      .map(([date, dailyData]: [string, any]) => (
                        <div key={date} className="space-y-2">
                          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1">
                            <span className="font-medium text-xs sm:text-sm">
                              {new Date(date).toLocaleDateString("en-GB")}
                            </span>
                            <span className="text-gray-600 text-xs sm:text-sm">
                              ₹{dailyData.revenue.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                            <div
                              className="bg-green-600 h-3 sm:h-4 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (dailyData.revenue / data.totalRevenue) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 text-xs text-gray-500">
                            <span>
                              {dailyData.keypadPhones} keypad •{" "}
                              {dailyData.smartphones} smart
                            </span>
                            <span className="text-xs">
                              Sales: ₹{dailyData.sales.toFixed(2)} • Service: ₹
                              {dailyData.service.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {Object.keys(shopPerformance).length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-12 text-center">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              No sales data found for the selected time period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
