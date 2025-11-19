import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { submitSalesData, clearError, clearSuccess } from "../store/salesSlice";
import { SalesFormData, PhoneModel } from "../types/sales";

const SalesForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.sales);

  const [formData, setFormData] = useState<SalesFormData>({
    shop: "",
    salesTotal: "",
    serviceTotal: "",
    keypadPhones: 0,
    smartphones: 0,
    keypadModels: [],
    smartphoneModels: [],
    date: new Date().toISOString().split("T")[0], // Set default to today's date
  });

  const shops = [" Mobile House 1(shed)", " Mobile House 2(3way)"];

  // Constant values for keypad phone models
  const keypadModelsList: PhoneModel[] = [
    { id: "k1", name: "Nokia" },
    { id: "k2", name: "itel" },
    { id: "k3", name: "lava" },
    { id: "k4", name: "samsung" },
    { id: "k5", name: "jio phone" },
    { id: "k6", name: "Karbonn" },
  ];

  // Constant values for smartphone models
  const smartphoneModelsList: PhoneModel[] = [
    { id: "s1", name: "Samsung" },
    { id: "s2", name: "oppo" },
    { id: "s3", name: "vivo" },
    { id: "s4", name: "realme" },
    { id: "s5", name: "redmi" },
    { id: "s6", name: "tecno" },
    { id: "s7", name: "iphone" },
    { id: "s8", name: "iqoo" },
    { id: "s9", name: "moto" },
    { id: "s10", name: "infinix" },
    { id: "s11", name: "nothing" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  const handleKeypadCountChange = (newCount: number) => {
    setFormData((prev) => {
      const currentCount = prev.keypadPhones;

      if (newCount > currentCount) {
        // Adding more phones - keep existing models and add empty slots if needed
        const additionalSlots = newCount - currentCount;
        const newModels = [...prev.keypadModels];

        for (let i = 0; i < additionalSlots; i++) {
          newModels.push({
            id: `keypad-${Date.now()}-${i}`,
            name: "",
            count: 1,
            price: 0, // Add price field back for total value calculation
          });
        }

        return {
          ...prev,
          keypadPhones: newCount,
          keypadModels: newModels,
        };
      } else {
        // Reducing phones - remove from the end
        const newModels = prev.keypadModels.slice(0, newCount);
        return {
          ...prev,
          keypadPhones: newCount,
          keypadModels: newModels,
        };
      }
    });
  };

  // Handle smartphone count change
  const handleSmartphoneCountChange = (newCount: number) => {
    setFormData((prev) => {
      const currentCount = prev.smartphones;

      if (newCount > currentCount) {
        // Adding more phones - keep existing models and add empty slots if needed
        const additionalSlots = newCount - currentCount;
        const newModels = [...prev.smartphoneModels];

        for (let i = 0; i < additionalSlots; i++) {
          newModels.push({
            id: `smartphone-${Date.now()}-${i}`,
            name: "",
            count: 1,
            price: 0, // Add price field back for total value calculation
          });
        }

        return {
          ...prev,
          smartphones: newCount,
          smartphoneModels: newModels,
        };
      } else {
        // Reducing phones - remove from the end
        const newModels = prev.smartphoneModels.slice(0, newCount);
        return {
          ...prev,
          smartphones: newCount,
          smartphoneModels: newModels,
        };
      }
    });
  };

  // Handle keypad model selection
  const handleKeypadModelSelect = (index: number, modelId: string) => {
    setFormData((prev) => {
      const newModels = [...prev.keypadModels];
      const selectedModel = keypadModelsList.find((m) => m.id === modelId);

      if (selectedModel) {
        newModels[index] = {
          ...selectedModel,
          count: 1,
          price: 0, // Initialize price to 0
        };
      } else {
        // If "Select a model" is chosen, reset the model
        newModels[index] = {
          id: `keypad-${Date.now()}`,
          name: "",
          count: 1,
          price: 0,
        };
      }

      return {
        ...prev,
        keypadModels: newModels,
      };
    });
  };

  // Handle smartphone model selection
  const handleSmartphoneModelSelect = (index: number, modelId: string) => {
    setFormData((prev) => {
      const newModels = [...prev.smartphoneModels];
      const selectedModel = smartphoneModelsList.find((m) => m.id === modelId);

      if (selectedModel) {
        newModels[index] = {
          ...selectedModel,
          count: 1,
          price: 0, // Initialize price to 0
        };
      } else {
        // If "Select a model" is chosen, reset the model
        newModels[index] = {
          id: `smartphone-${Date.now()}`,
          name: "",
          count: 1,
          price: 0,
        };
      }

      return {
        ...prev,
        smartphoneModels: newModels,
      };
    });
  };

  // Handle keypad model details change
  const handleKeypadModelChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newModels = [...prev.keypadModels];

      if (!newModels[index]) {
        newModels[index] = {
          id: `keypad-${Date.now()}`,
          name: "",
          count: 1,
          price: 0,
        };
      }

      newModels[index] = {
        ...newModels[index],
        [field]: field === "count" || field === "price" ? Number(value) : value,
      };

      return {
        ...prev,
        keypadModels: newModels,
      };
    });
  };

  // Handle smartphone model details change
  const handleSmartphoneModelChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newModels = [...prev.smartphoneModels];

      if (!newModels[index]) {
        newModels[index] = {
          id: `smartphone-${Date.now()}`,
          name: "",
          count: 1,
          price: 0,
        };
      }

      newModels[index] = {
        ...newModels[index],
        [field]: field === "count" || field === "price" ? Number(value) : value,
      };

      return {
        ...prev,
        smartphoneModels: newModels,
      };
    });
  };

  // Handle model quantity change
  const handleModelQuantityChange = (
    type: "keypad" | "smartphone",
    index: number,
    newQuantity: number
  ) => {
    setFormData((prev) => {
      const models =
        type === "keypad" ? [...prev.keypadModels] : [...prev.smartphoneModels];

      if (models[index]) {
        models[index] = {
          ...models[index],
          count: Math.max(1, newQuantity),
        };
      }

      return {
        ...prev,
        [type === "keypad" ? "keypadModels" : "smartphoneModels"]: models,
      };
    });
  };

  // Add new keypad phone entry
  const addKeypadPhone = () => {
    handleKeypadCountChange(formData.keypadPhones + 1);
  };

  // Add new smartphone entry
  const addSmartphone = () => {
    handleSmartphoneCountChange(formData.smartphones + 1);
  };

  // Remove specific phone entry
  const removePhoneEntry = (type: "keypad" | "smartphone", index: number) => {
    if (type === "keypad") {
      setFormData((prev) => {
        const newModels = prev.keypadModels.filter((_, i) => i !== index);
        return {
          ...prev,
          keypadPhones: prev.keypadPhones - 1,
          keypadModels: newModels,
        };
      });
    } else {
      setFormData((prev) => {
        const newModels = prev.smartphoneModels.filter((_, i) => i !== index);
        return {
          ...prev,
          smartphones: prev.smartphones - 1,
          smartphoneModels: newModels,
        };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(clearSuccess());
    dispatch(submitSalesData(formData));
  };

  const resetForm = () => {
    setFormData({
      shop: "",
      salesTotal: "",
      serviceTotal: "",
      keypadPhones: 0,
      smartphones: 0,
      keypadModels: [],
      smartphoneModels: [],
      date: new Date().toISOString().split("T")[0], // Reset to today's date
    });
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        resetForm();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Calculate totals
  const calculateKeypadTotal = () => {
    return formData.keypadModels.reduce(
      (total, model) => total + (model.count || 1),
      0
    );
  };

  const calculateSmartphoneTotal = () => {
    return formData.smartphoneModels.reduce(
      (total, model) => total + (model.count || 1),
      0
    );
  };

  const calculateKeypadValueTotal = () => {
    return formData.keypadModels.reduce(
      (total, model) => total + (model.price || 0) * (model.count || 1),
      0
    );
  };

  const calculateSmartphoneValueTotal = () => {
    return formData.smartphoneModels.reduce(
      (total, model) => total + (model.price || 0) * (model.count || 1),
      0
    );
  };

  const totalPhoneSales = calculateKeypadTotal() + calculateSmartphoneTotal();
  const totalPhoneValue =
    calculateKeypadValueTotal() + calculateSmartphoneValueTotal();
  const grandTotal =
    parseFloat(formData.salesTotal || "0") +
    parseFloat(formData.serviceTotal || "0") +
    totalPhoneValue;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
        Sales Data Entry
      </h2>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm md:text-base">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm md:text-base">
          Sales data submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Select Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          {/* Shop Selection */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Select Shop *
            </label>
            <select
              name="shop"
              value={formData.shop}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            >
              <option value="">Select a shop</option>
              {shops.map((shop) => (
                <option key={shop} value={shop}>
                  {shop}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sales Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Sales Total (₹) *
            </label>
            <input
              type="number"
              name="salesTotal"
              value={formData.salesTotal}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Service Total (₹) *
            </label>
            <input
              type="number"
              name="serviceTotal"
              value={formData.serviceTotal}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Keypad Phones Section */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Keypad Phones
            </h3>
          </div>

          {/* Keypad Phone Counter */}
          <div className="mb-6">
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Total Keypad Phones Sold: {formData.keypadPhones}
            </label>
          </div>

          {/* Keypad Model Selection Boxes */}
          {formData.keypadPhones > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">
                Keypad Phone Details:
              </h4>
              {formData.keypadModels.map((model, index) => (
                <div
                  key={model.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 relative"
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removePhoneEntry("keypad", index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Model Name - Select Box */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Name *
                      </label>
                      <select
                        value={model.name ? model.id : ""}
                        onChange={(e) =>
                          handleKeypadModelSelect(index, e.target.value)
                        }
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Select a model</option>
                        {keypadModelsList.map((modelOption) => (
                          <option key={modelOption.id} value={modelOption.id}>
                            {modelOption.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleModelQuantityChange(
                              "keypad",
                              index,
                              (model.count || 1) - 1
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-bold hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={model.count || 1}
                          onChange={(e) =>
                            handleKeypadModelChange(
                              index,
                              "count",
                              e.target.value
                            )
                          }
                          min="1"
                          className="w-16 p-2 border border-gray-300 rounded text-center text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleModelQuantityChange(
                              "keypad",
                              index,
                              (model.count || 1) + 1
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-bold hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Value (₹) *
                      </label>
                      <input
                        type="number"
                        value={model.price || ""}
                        onChange={(e) =>
                          handleKeypadModelChange(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addKeypadPhone}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <h1>+ Add Keypad Phone</h1>
          </button>
        </div>

        {/* Smartphones Section */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
              Smartphones
            </h3>
          </div>

          {/* Smartphone Counter */}
          <div className="mb-6">
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Total Smartphones Sold: {formData.smartphones}
            </label>
          </div>

          {/* Smartphone Model Selection Boxes */}
          {formData.smartphones > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Smartphone Details:</h4>
              {formData.smartphoneModels.map((model, index) => (
                <div
                  key={model.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 relative"
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removePhoneEntry("smartphone", index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Model Name - Select Box */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Name *
                      </label>
                      <select
                        value={model.name ? model.id : ""}
                        onChange={(e) =>
                          handleSmartphoneModelSelect(index, e.target.value)
                        }
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Select a model</option>
                        {smartphoneModelsList.map((modelOption) => (
                          <option key={modelOption.id} value={modelOption.id}>
                            {modelOption.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleModelQuantityChange(
                              "smartphone",
                              index,
                              (model.count || 1) - 1
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-bold hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={model.count || 1}
                          onChange={(e) =>
                            handleSmartphoneModelChange(
                              index,
                              "count",
                              e.target.value
                            )
                          }
                          min="1"
                          className="w-16 p-2 border border-gray-300 rounded text-center text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleModelQuantityChange(
                              "smartphone",
                              index,
                              (model.count || 1) + 1
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-bold hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Value (₹) *
                      </label>
                      <input
                        type="number"
                        value={model.price || ""}
                        onChange={(e) =>
                          handleSmartphoneModelChange(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addSmartphone}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>+ Add Smartphone</span>
          </button>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 p-4 md:p-6 rounded-lg">
          <h3 className="text-lg md:text-xl font-semibold mb-3 text-blue-800">
            Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base">
            <div>
              <span className="text-gray-600">Total Phones:</span>
              <div className="font-semibold">
                {formData.keypadPhones + formData.smartphones}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Keypad:</span>
              <div className="font-semibold">{formData.keypadPhones}</div>
            </div>
            <div>
              <span className="text-gray-600">Smartphones:</span>
              <div className="font-semibold">{formData.smartphones}</div>
            </div>
            <div>
              <span className="text-gray-600">Phone Sales:</span>
              <div className="font-semibold text-green-600">
                {totalPhoneSales} phones
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
              <div>
                <span className="text-gray-600">Keypad Value:</span>
                <div className="font-semibold text-blue-600">
                  ₹{calculateKeypadValueTotal().toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Smartphone Value:</span>
                <div className="font-semibold text-blue-600">
                  ₹{calculateSmartphoneValueTotal().toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total Phone Value:</span>
                <div className="font-semibold text-green-600">
                  ₹{totalPhoneValue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-800">Grand Total:</span>
              <span className="text-green-600">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col xs:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base font-medium"
          >
            {loading ? "Submitting..." : "Submit Sales Data"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm md:text-base font-medium"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesForm;
