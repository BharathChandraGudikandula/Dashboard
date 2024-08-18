import React, { useState } from "react";
import "./../styles/Dashboard.css";
import image1 from "./../images/1.PNG";
import image2 from "./../images/2.PNG";
import image3 from "./../images/3.PNG";
import image5 from "./../images/5.PNG";
import image6 from "./../images/6.PNG";


const initialDashboardData = {
  categories: [
    {
      name: "CSPM Executive Dashboard",
      widgets: [
        {
          name: "Cloud Accounts",
          imagePath: image1,
          description: "2 connected, 2 not connected",
        },
        {
          name: "Cloud Account Risk Assessment",
          imagePath: image2,
          description: "9659 total - 1689 failed, 681 warning, 7253 passed",
        }
      ]
    },
    {
      name: "CWPP Dashboard",
      widgets: [
        {
          name: "Top 5 Namespace Specific Alerts",
          imagePath: image3,
          description: "No graph data available",
        },
        {
          name: "Workload Alerts",
          imagePath: image3,
          description: "No graph data available",
        }
      ]
    },
    {
      name: "Registry Scan",
      widgets: [
        {
          name: "Image Risk Assessment",
          description: "1470 total vulnerabilities",
          imagePath: image5
        },
        {
          name: "Image Security Issues",
          description: "2 total images",
          imagePath: image6
        }
      ]
    }
  ]
};

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [widgetName, setWidgetName] = useState("");
  const [widgetText, setWidgetText] = useState("");
  const [selectedWidgets, setSelectedWidgets] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("2days");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

  const handleAddWidgetClick = (categoryIndex = null) => {
    if (categoryIndex !== null) {
      const category = dashboardData.categories[categoryIndex];
      setSelectedCategory(category);
      const selected = {};
      category.widgets.forEach(widget => {
        selected[widget.name] = true;
      });
      setSelectedWidgets(selected);
    }
    setShowSidebar(true);
  };

  const handleConfirm = () => {
    let updatedCategories = [...dashboardData.categories];

    if (widgetName && widgetText) {
      updatedCategories = updatedCategories.map(category => {
        if (category.name === selectedCategory.name) {
          return {
            ...category,
            widgets: [
              ...category.widgets.filter(widget => !selectedWidgets[widget.name]),
              { name: widgetName, description: widgetText }
            ]
          };
        }
        return category;
      });
    } else {
      updatedCategories = updatedCategories.map(category => {
        if (category.name === selectedCategory.name) {
          return {
            ...category,
            widgets: category.widgets.filter(widget => !selectedWidgets[widget.name])
          };
        }
        return category;
      });
    }

    setDashboardData({ categories: updatedCategories });
    setWidgetName("");
    setWidgetText("");
    setSelectedWidgets({});
    setShowSidebar(false);
  };

  const handleCheckboxChange = (widgetName) => {
    setSelectedWidgets(prev => ({ ...prev, [widgetName]: !prev[widgetName] }));
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  const handleRefresh = () => {
    setDashboardData(prevState => ({ ...prevState }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterWidgets = (widgets) => {
    return widgets.filter(widget =>
      widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleRemoveWidget = (categoryIndex, widgetIndex) => {
    const updatedCategories = [...dashboardData.categories];
    updatedCategories[categoryIndex].widgets.splice(widgetIndex, 1);
    setDashboardData({ categories: updatedCategories });
  };

  const handleTimeRangeChange = (e) => {
    setSelectedTimeRange(e.target.value);
  };

  const handleLoginClick = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Implement authentication logic here
    console.log("Logging in with:", loginCredentials);
    setShowLoginForm(false);
  };

  const handleCancelLogin = () => {
    setShowLoginForm(false);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div className="breadcrumbs">
          <a href="#home">Home</a> &gt; <a href="#dashboard">Dashboard V2</a>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search anything..."
            className="search-bar"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="notifications-user">
          <button className="notifications-btn">🔔</button>
          <button className="user-login-btn" onClick={handleLoginClick}>👤</button>
        </div>
      </div>

      <nav className="navbar">
        <h1 className="navbar-title">CNAPP Dashboard</h1>
        <div className="navbar-right">
          <button className="add-widget" onClick={() => handleAddWidgetClick(null)}>
            + Add Widget
          </button>
          <button className="refresh-btn" onClick={handleRefresh}>⟳ Refresh</button>
          <select className="time-range" value={selectedTimeRange} onChange={handleTimeRangeChange}>
            <option value="1day">Last 1 day</option>
            <option value="2days">Last 2 days</option>
            <option value="7days">Last 7 days</option>
          </select>
        </div>
      </nav>

      <div className="categories-container">
        {dashboardData.categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="category">
            <h2>{category.name}</h2>
            <div className="widgets-container">
              {filterWidgets(category.widgets).map((widget, widgetIndex) => (
                <div key={widgetIndex} className="widget">
                  <div className="widget-content">
                    <h4>{widget.name}</h4>
                    <p>{widget.description}</p>
                    {widget.imagePath && <img src={widget.imagePath} alt={widget.name} className="widget-image" />}
                  </div>
                  <button 
                    className="remove-widget-btn" 
                    onClick={() => handleRemoveWidget(categoryIndex, widgetIndex)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="widget add-widget">
                <button onClick={() => handleAddWidgetClick(categoryIndex)}>
                  + Add Widget
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSidebar && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Add Widget</h2>
            <button className="close-sidebar" onClick={handleCloseSidebar}>
              &times;
            </button>
          </div>
          <div className="sidebar-body">
            <p>Personalize your dashboard by adding or removing widgets:</p>
            <div className="categories">
              {dashboardData.categories.map((category, index) => (
                <button key={index} className={`category-button ${selectedCategory?.name === category.name ? 'active' : ''}`} onClick={() => handleAddWidgetClick(index)}>
                  {category.name}
                </button>
              ))}
            </div>
            {selectedCategory && selectedCategory.widgets.map((widget, index) => (
              <div key={index} className="widget-option">
                <input
                  type="checkbox"
                  checked={selectedWidgets[widget.name] || false}
                  onChange={() => handleCheckboxChange(widget.name)}
                />
                <label>{widget.name}</label>
              </div>
            ))}
            {selectedCategory && (
              <>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Widget Name"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Widget Text"
                  value={widgetText}
                  onChange={(e) => setWidgetText(e.target.value)}
                />
              </>
            )}
          </div>
          <div className="sidebar-footer">
            <button className="confirm-btn" onClick={handleConfirm}>
              Confirm
            </button>
            <button className="cancel-btn" onClick={handleCloseSidebar}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showLoginForm && (
        <div className="login-form-container">
          <div className="login-form">
            <form onSubmit={handleLoginSubmit}>
              <div className="login-inputs">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={loginCredentials.username}
                  onChange={handleLoginChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginCredentials.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="login-buttons">
                <button type="submit">Login</button>
                <button type="button" onClick={handleCancelLogin}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
