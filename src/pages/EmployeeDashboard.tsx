import React, { useState } from "react";
import Footer from "../components/Footer";
import "../css/EmployeeDashboard.css";
import { useNavigate } from "react-router-dom";
import EmployeeNavBar from "../components/EmployeeNavBar";

interface DashboardTile {
  title: string;
  description: string;
  icon: string;
  route: string;
  routeAdd: string;
  buttonName: string;
}

const EmployeeDashboard: React.FC = () => {
  const [searchTerm] = useState("");
  const navigate = useNavigate();

  const dashboardTiles: DashboardTile[] = [
    {
      title: "Manage Foods",
      description: "Update and Delete Foods",
      icon: "🍕",
      route: "/employee/view/foods",
      routeAdd: "/employee/add/food",
      buttonName: " foods",
    },
    {
      title: "Manage Employees",
      description: "Update and Delete Employees",
      icon: "👨‍🍳",
      route: "/employee/view/employees",
      routeAdd: "/employee/add/employee",
      buttonName: " employees",
    },
    {
      title: "View Orders",
      description: "View Order History and Update Status",
      icon: "📦",
      route: "/employee/view/orders",
      routeAdd: "",
      buttonName: "",
    },
  ];

  const filteredTiles = dashboardTiles.filter(
    (tile) =>
      tile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tile.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateTo = (route: string) => {
    navigate(route);
  };

  const navigateToAdd = (routeAdd: string) => {
    navigate(routeAdd);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <EmployeeNavBar />

      <main className="container mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Employee Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTiles.map((tile, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
              onClick={() => navigateTo(tile.route)}
            >
              <div className="p-6">
                <div className="text-3xl mb-2">{tile.icon}</div>
                <h3 className="font-bold text-lg mb-2">{tile.title}</h3>
                <p className="text-gray-600">{tile.description}</p>
                {tile.routeAdd && (
                  <button
                    className="add-button mt-4"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click event
                      navigateToAdd(tile.routeAdd);
                    }}
                  >
                    Add{tile.buttonName}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <div className="footer3">
        <Footer />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
