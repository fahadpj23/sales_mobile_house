import SalesForm from "../../components/salesForm";
import SalesList from "../../components/salesList";

const SalesUpload = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <div className="container mx-auto px-4">
        <SalesForm />
        <div className="mt-8 md:mt-12">
          <SalesList />
        </div>
      </div>
    </div>
  );
};
export default SalesUpload;
