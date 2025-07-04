"use client";
import React, { useEffect, useState } from "react";

const PhoneUploader = () => {
  const [formData, setFormData] = useState({
    chipset: [""],
    ram: [""],
    storage: [""],
    network: [""],
    frontCamera: [""],
    backCamera: [""],
    pros: [""],
    cons: [""],
    ratings: [{}],
    features: [{}],
    general: [{}],
    table: [{}],
    specification: [{}],
  });
  const [images, setImages] = useState([]);
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [inputCount, setInputCount] = useState({
    chipset: 1,
    ram: 1,
    storage: 1,
    network: 1,
    frontCamera: 1,
    backCamera: 1,
    pros: 1,
    cons: 1,
    ratings: 1,
    features: 1,
    general: 1,
    table: 1,
  });

  useEffect(() => {
    const endpoints = [
      { url: "/api/status/get-all", setter: "status" },
      { url: "/api/brand/get-all", setter: "brand" },
      { url: "/api/category/get-all", setter: "category" },
      { url: "/api/displaytype/get-all", setter: "displaytype" },
      { url: "/api/displayresolution/get-all", setter: "displayresolution" },
      { url: "/api/refreshrate/get-all", setter: "refreshrate" },
      { url: "/api/os/get-all", setter: "os" },
      { url: "/api/chipset/get-all", setter: "chipset" },
      { url: "/api/ram/get-all", setter: "ram" },
      { url: "/api/storage/get-all", setter: "storage" },
      { url: "/api/fabrication/get-all", setter: "fabrication" },
      { url: "/api/corecount/get-all", setter: "corecount" },
      { url: "/api/camera/get-all", setter: "camera" },
      { url: "/api/network/get-all", setter: "network" },
      { url: "/api/bluetooth/get-all", setter: "bluetooth" },
      { url: "/api/wifiversion/get-all", setter: "wifiversion" },
      { url: "/api/wifitype/get-all", setter: "wifitype" },
      { url: "/api/usbtype/get-all", setter: "usbtype" },
      { url: "/api/batterytype/get-all", setter: "batterytype" },
      { url: "/api/specification/get-all", setter: "specification" },
    ];

    const fetchAllData = async () => {
      for (const { url, setter } of endpoints) {
        try {
          const response = await fetch(`http://localhost:5050${url}`);
          const result = await response.json();
          setFilterValues((pre) => ({ ...pre, [setter]: result.data }));
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
        }
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeArray = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedArray = [...prev[name]];
      updatedArray[index] = value;
      return {
        ...prev,
        [name]: updatedArray,
      };
    });
  };

  const handleChangeArrayObject = (e, index, field) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedArray = [...(prev[name] || [])];
      const existing = updatedArray[index] || { key: "", value: "" };
      updatedArray[index] = {
        ...existing,
        [field]: value,
      };
      return {
        ...prev,
        [name]: updatedArray,
      };
    });
  };

  const handleChangeSpecification = (keyvalue, index) => {
    const { key, value } = keyvalue;
    setFormData((prev) => {
      const updatedArray = [...prev["specification"]];
      updatedArray[index] = { key: key || "", value: value || "" };
      return {
        ...prev,
        specification: updatedArray,
      };
    });
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("json_data", JSON.stringify(cleanObject(formData)));

    images.forEach((file) => {
      data.append("images", file);
    });

    try {
      const res = await fetch("http://localhost:5050/api/phone/create", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      const responseData = await res.json();
      setResponse(responseData);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "display", label: "Display" },
    { id: "hardware", label: "Hardware" },
    { id: "camera", label: "Camera" },
    { id: "connectivity", label: "Connectivity" },
    { id: "battery", label: "Battery" },
    { id: "features", label: "Features" },
    { id: "specification", label: "Specifications" },
    { id: "media", label: "Media" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                value={formData.name}
                name="name"
                placeholder="Phone Name"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <select
                value={formData.brand}
                name="brand"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Brand</option>
                {filterValues?.brand?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <input
                value={formData.price}
                name="price"
                placeholder="Price"
                type="number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Discounted Price ($)
              </label>
              <input
                value={formData.newPrice}
                name="newPrice"
                placeholder="New Price"
                type="number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={formData.category}
                name="category"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Category</option>
                {filterValues?.category?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Status</option>
                {filterValues?.status?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Official
              </label>
              <select
                name="official"
                value={formData.official}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Unofficial
              </label>
              <select
                name="unofficial"
                value={formData.unofficial}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        );
      case "display":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Display Type
              </label>
              <select
                name="displayType"
                value={formData.displayType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Type</option>
                {filterValues?.displaytype?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Display Size (inches)
              </label>
              <input
                name="displaySize"
                value={formData.displaySize}
                placeholder="e.g., 6.5"
                type="number"
                step="0.1"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Resolution
              </label>
              <select
                name="displayResolution"
                value={formData.displayResolution}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Resolution</option>
                {filterValues?.displayresolution?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Refresh Rate (Hz)
              </label>
              <select
                name="refreshRate"
                value={formData.refreshRate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Refresh Rate</option>
                {filterValues?.refreshrate?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Screen-to-Body Ratio (%)
              </label>
              <input
                name="screenBodyRatio"
                value={formData.screenBodyRatio}
                placeholder="e.g., 85.2"
                type="number"
                step="0.1"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                PPI
              </label>
              <input
                name="ppi"
                value={formData.ppi}
                placeholder="Pixels per inch"
                type="number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              />
            </div>
          </div>
        );
      case "hardware":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Operating System
                </label>
                <select
                  name="os"
                  value={formData.os}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select OS</option>
                  {filterValues?.os?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Chipset</h3>
              <div className="space-y-4">
                {[...Array(inputCount?.chipset)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <select
                      name="chipset"
                      value={formData.chipset[i]}
                      onChange={(e) => handleChangeArray(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                    >
                      <option value="">Select Chipset</option>
                      {filterValues?.chipset?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        chipset: prev.chipset + 1,
                      }))
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add Chipset
                  </button>
                  {inputCount?.chipset > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          chipset: prev.chipset - 1,
                        }));
                        handleChangeArray(
                          { target: { name: "chipset", value: "" } },
                          inputCount?.chipset - 1
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      - Remove Last
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">RAM</h3>
              <div className="space-y-4">
                {[...Array(inputCount?.ram)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <select
                      name="ram"
                      value={formData.ram[i]}
                      onChange={(e) => handleChangeArray(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                    >
                      <option value="">Select RAM</option>
                      {filterValues?.ram?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        ram: prev.ram + 1,
                      }))
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add RAM
                  </button>
                  {inputCount?.ram > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          ram: prev.ram - 1,
                        }));
                        handleChangeArray(
                          { target: { name: "ram", value: "" } },
                          inputCount?.ram - 1
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      - Remove Last
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Storage</h3>
              <div className="space-y-4">
                {[...Array(inputCount?.storage)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <select
                      name="storage"
                      value={formData.storage[i]}
                      onChange={(e) => handleChangeArray(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                    >
                      <option value="">Select Storage</option>
                      {filterValues?.storage?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        storage: prev.storage + 1,
                      }))
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add Storage
                  </button>
                  {inputCount?.storage > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          storage: prev.storage - 1,
                        }));
                        handleChangeArray(
                          { target: { name: "storage", value: "" } },
                          inputCount?.storage - 1
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      - Remove Last
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Fabrication (nm)
                </label>
                <select
                  name="fabrication"
                  value={formData.fabrication}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select Fabrication</option>
                  {filterValues?.fabrication?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Core Count
                </label>
                <select
                  name="corecount"
                  value={formData.corecount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select Core Count</option>
                  {filterValues?.corecount?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      case "camera":
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Back Camera</h3>
              <div className="space-y-4">
                {[...Array(inputCount?.backCamera)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <select
                      name="backCamera"
                      value={formData.backCamera[i]}
                      onChange={(e) => handleChangeArray(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                    >
                      <option value="">Select Camera</option>
                      {filterValues?.camera?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        backCamera: prev.backCamera + 1,
                      }))
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add Back Camera
                  </button>
                  {inputCount?.backCamera > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          backCamera: prev.backCamera - 1,
                        }));
                        handleChangeArray(
                          { target: { name: "backCamera", value: "" } },
                          inputCount?.backCamera - 1
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      - Remove Last
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Front Camera</h3>
              <div className="space-y-4">
                {[...Array(inputCount?.frontCamera)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <select
                      name="frontCamera"
                      value={formData.frontCamera[i]}
                      onChange={(e) => handleChangeArray(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                    >
                      <option value="">Select Camera</option>
                      {filterValues?.camera?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        frontCamera: prev.frontCamera + 1,
                      }))
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add Front Camera
                  </button>
                  {inputCount?.frontCamera > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          frontCamera: prev.frontCamera - 1,
                        }));
                        handleChangeArray(
                          { target: { name: "frontCamera", value: "" } },
                          inputCount?.frontCamera - 1
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      - Remove Last
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "connectivity":
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Network</h3>
              <div className="space-y-4">
                {[...Array(inputCount?.network)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <select
                      name="network"
                      value={formData.network[i]}
                      onChange={(e) => handleChangeArray(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                    >
                      <option value="">Select Network</option>
                      {filterValues?.network?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        network: prev.network + 1,
                      }))
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add Network
                  </button>
                  {inputCount?.network > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          network: prev.network - 1,
                        }));
                        handleChangeArray(
                          { target: { name: "network", value: "" } },
                          inputCount?.network - 1
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      - Remove Last
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Bluetooth
                </label>
                <select
                  name="bluetooth"
                  value={formData.bluetooth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select Bluetooth</option>
                  {filterValues?.bluetooth?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  WiFi Version
                </label>
                <select
                  name="wifiversion"
                  value={formData.wifiversion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select WiFi Version</option>
                  {filterValues?.wifiversion?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  WiFi Type
                </label>
                <select
                  name="wifitype"
                  value={formData.wifitype}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select WiFi Type</option>
                  {filterValues?.wifitype?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  USB Type
                </label>
                <select
                  name="usbtype"
                  value={formData.usbtype}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select USB Type</option>
                  {filterValues?.usbtype?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  GPS
                </label>
                <select
                  name="gps"
                  value={formData.gps}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select Option</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  NFC
                </label>
                <select
                  name="nfc"
                  value={formData.nfc}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select Option</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>
        );
      case "battery":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Battery Type
              </label>
              <select
                name="batterytype"
                value={formData.batterytype}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              >
                <option value="">Select Type</option>
                {filterValues?.batterytype?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Battery Capacity (mAh)
              </label>
              <input
                name="batteryCapacity"
                placeholder="e.g., 5000"
                type="number"
                value={formData.batteryCapacity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Charging Support (w)
              </label>
              <input
                name="chargingSupport"
                placeholder="e.g., 65"
                value={formData.chargingSupport}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
              />
            </div>
          </div>
        );
      case "features":
        return (
          <div className="space-y-6">
            {[
              { key: "ratings", display: "Ratings" },
              { key: "features", display: "Features" },
              { key: "general", display: "General" },
              { key: "table", display: "Table" },
            ].map((item) => (
              <div key={item.key} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">
                  {item.display}
                </h3>
                <div className="space-y-4">
                  {[...Array(inputCount[item.key])].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          name={item.key}
                          placeholder="Key"
                          value={formData[item?.key]?.[i]?.key || ""}
                          onChange={(e) =>
                            handleChangeArrayObject(e, i, "key")
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                        />
                        <input
                          name={item.key}
                          placeholder="Value"
                          value={formData[item?.key]?.[i]?.value || ""}
                          onChange={(e) =>
                            handleChangeArrayObject(e, i, "value")
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setInputCount((prev) => ({
                          ...prev,
                          [item.key]: prev[item.key] + 1,
                        }))
                      }
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                    >
                      + Add {item.display}
                    </button>
                    {inputCount[item.key] > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setInputCount((prev) => ({
                            ...prev,
                            [item.key]: prev[item.key] - 1,
                          }));
                          handleChangeArrayObject(
                            { target: { name: item.key, value: "" } },
                            inputCount[item.key] - 1,
                            "value"
                          );
                          handleChangeArrayObject(
                            { target: { name: item.key, value: "" } },
                            inputCount[item.key] - 1,
                            "key"
                          );
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                      >
                        - Remove Last
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Pros</h3>
              <div className="space-y-4">
                {[...Array(inputCount?.pros)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <input
                      name="pros"
                      placeholder="Great display"
                      value={formData.pros[i]}
                      onChange={(e) => handleChangeArray(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        pros: prev.pros + 1,
                      }))
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add Pros
                  </button>
                  {inputCount?.pros > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          pros: prev.pros - 1,
                        }));
                        handleChangeArray(
                          { target: { name: "pros", value: "" } },
                          inputCount?.pros - 1
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      - Remove Last
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Cons</h3>
              <div className="space-y-4">
                {[...Array(inputCount?.cons)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <input
                      name="cons"
                      placeholder="Only 3GB RAM"
                      value={formData.cons[i]}
                      onChange={(e) => handleChangeArray(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        cons: prev.cons + 1,
                      }))
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    + Add Cons
                  </button>
                  {inputCount?.cons > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          cons: prev.cons - 1,
                        }));
                        handleChangeArray(
                          { target: { name: "cons", value: "" } },
                          inputCount?.cons - 1
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      - Remove Last
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "specification":
        const groupedByCategory = filterValues?.specification?.reduce(
          (acc, item) => {
            const catId = item.category._id;
            const catName = item.category.name;

            if (!acc[catId]) {
              acc[catId] = {
                name: catName,
                items: [],
              };
            }

            acc[catId].items.push(item);
            return acc;
          },
          {}
        );

        let globalIndex = 0;

        return (
          <div className="space-y-6">
            {groupedByCategory &&
              Object.values(groupedByCategory).map((group) => (
                <div
                  key={group.name}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-100 px-4 py-3">
                    <h3 className="font-medium text-gray-800">{group.name}</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {group.items.map((item) => {
                      const currentIndex = globalIndex++;
                      return (
                        <div key={item._id} className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            {item.name}
                          </label>
                          <textarea
                            name={item._id}
                            placeholder="Enter specification details"
                            value={
                              formData.specification[currentIndex]?.value || ""
                            }
                            onChange={(e) =>
                              handleChangeSpecification(
                                {
                                  key: item._id,
                                  value: e.target.value,
                                },
                                currentIndex
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all min-h-[80px]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        );
      case "media":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Weight (g)
                </label>
                <input
                  name="weight"
                  placeholder="e.g., 205"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  3.5mm Jack
                </label>
                <select
                  name="threePointFive"
                  value={formData.threePointFive}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select Option</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Stereo Speakers
                </label>
                <select
                  name="stereo"
                  value={formData.stereo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select Option</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  FM Radio
                </label>
                <select
                  name="fm"
                  value={formData.fm}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black transition-all"
                >
                  <option value="">Select Option</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              {images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-700">
                    {images.length} {images.length === 1 ? "file" : "files"}{" "}
                    selected
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.from(images).map((file, index) => (
                      <div
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Phone Uploader
          </h1>
          <p className="text-lg text-gray-600">
            Add a new phone to the database
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="space-y-6">{renderTabContent()}</div>

            <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Phone"
                )}
              </button>
            </div>
          </form>
        </div>

        {response && (
          <div className="mt-8 bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Response</h3>
            </div>
            <div className="p-6">
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm text-gray-800">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneUploader;

function cleanObject(obj) {
  const result = {};

  for (const key in obj) {
    const val = obj[key];

    if (typeof val === "string") {
      if (val.trim() !== "") {
        result[key] = val;
      }
    } else if (Array.isArray(val)) {
      const cleanedArray = val.filter((item) => {
        if (item === undefined || item === null) return false;
        if (typeof item === "string") return false;
        if (typeof item === "object" && Object.keys(item).length === 0)
          return false;
        if (typeof item === "object" && "value" in item) {
          return item.value?.toString().trim() !== "";
        }
        return true;
      });

      if (cleanedArray.length > 0) {
        result[key] = cleanedArray;
      }
    } else if (val !== undefined && val !== null) {
      result[key] = val;
    }
  }

  return result;
}