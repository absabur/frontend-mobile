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
      const updatedArray = [...prev[name]]; // clone the array
      updatedArray[index] = value; // update index
      return {
        ...prev,
        [name]: updatedArray, // set updated array back
      };
    });
  };
  const handleChangeArrayObject = (e, index) => {
    const { name, value } = e.target;
    const [key, values] = value.split(",").map((s) => s.trim());

    setFormData((prev) => {
      const updatedArray = [...prev[name]]; // clone the array
      updatedArray[index] = { key: key || "", value: values || "" }; // update index
      return {
        ...prev,
        [name]: updatedArray, // set updated array back
      };
    });
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitting(true);
    console.log(formData);

    const data = new FormData();
    data.append("json_data", JSON.stringify(formData));

    images.forEach((file) => {
      data.append("images", file);
    });

    // try {
    //   const res = await fetch("http://localhost:5050/api/phone/create", {
    //     method: "POST",
    //     body: data,
    //     credentials: "include",
    //   });
    //   const responseData = await res.json();
    //   setResponse(responseData);
    // } catch (err) {
    //   setResponse({ error: err.message });
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "display", label: "Display" },
    { id: "hardware", label: "Hardware" },
    { id: "camera", label: "Camera" },
    { id: "connectivity", label: "Connectivity" },
    { id: "battery", label: "Battery" },
    { id: "features", label: "Features" },
    { id: "media", label: "Media" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                placeholder="Phone Name"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <select
                name="brand"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Brand--</option>
                {filterValues?.brand &&
                  filterValues?.brand?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                name="price"
                placeholder="Price"
                type="number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price ($)
              </label>
              <input
                name="newPrice"
                placeholder="New Price"
                type="number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Category--</option>
                {filterValues?.category &&
                  filterValues?.category?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Status--</option>
                {filterValues?.status &&
                  filterValues?.status?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Official
              </label>
              <select
                name="official"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unofficial
              </label>
              <select
                name="unofficial"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        );
      case "display":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Type
              </label>
              <select
                name="displayType"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Type--</option>
                {filterValues?.displaytype &&
                  filterValues?.displaytype?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Size (inches)
              </label>
              <input
                name="displaySize"
                placeholder="e.g., 6.5"
                type="number"
                step="0.1"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution
              </label>
              <select
                name="displayResolution"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Resolution--</option>
                {filterValues?.displayresolution &&
                  filterValues?.displayresolution?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refresh Rate (Hz)
              </label>
              <select
                name="refreshRate"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Refresh Rate--</option>
                {filterValues?.refreshrate &&
                  filterValues?.refreshrate?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Screen-to-Body Ratio (%)
              </label>
              <input
                name="screenBodyRatio"
                placeholder="e.g., 85.2"
                type="number"
                step="0.1"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PPI
              </label>
              <input
                name="ppi"
                placeholder="Pixels per inch"
                type="number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        );
      case "hardware":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating System
              </label>
              <select
                name="os"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select OS--</option>
                {filterValues?.os &&
                  filterValues?.os?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {[...Array(inputCount?.chipset)].map((_, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chipset (JSON)
                </label>
                <select
                  name="chipset"
                  onChange={(e) => handleChangeArray(e, i)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">--Select Chipset--</option>
                  {filterValues?.chipset &&
                    filterValues?.chipset?.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setInputCount((prev) => ({
                    ...prev,
                    chipset: prev.chipset + 1,
                  }))
                }
                className="text-black border border-black p-3 bg-indigo-200"
              >
                Add Another Chipset Field
              </button>
              {inputCount?.chipset > 1 && (
                <button
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
                  className="text-black border border-black p-3 bg-red-200"
                >
                  Remove Last Chipset Field
                </button>
              )}
            </div>
            {[...Array(inputCount?.ram)].map((_, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RAM (JSON)
                </label>
                <select
                  name="ram"
                  onChange={(e) => handleChangeArray(e, i)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">--Select Ram--</option>
                  {filterValues?.ram &&
                    filterValues?.ram?.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setInputCount((prev) => ({
                    ...prev,
                    ram: prev.ram + 1,
                  }))
                }
                className="text-black border border-black p-3 bg-indigo-200"
              >
                Add Another Ram Field
              </button>
              {inputCount?.ram > 1 && (
                <button
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
                  className="text-black border border-black p-3 bg-red-200"
                >
                  Remove Last Ram Field
                </button>
              )}
            </div>
            {[...Array(inputCount?.storage)].map((_, i) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage (JSON)
                </label>
                <select
                  name="storage"
                  onChange={(e) => handleChangeArray(e, i)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">--Select Storage--</option>
                  {filterValues?.storage &&
                    filterValues?.storage?.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setInputCount((prev) => ({
                    ...prev,
                    storage: prev.storage + 1,
                  }))
                }
                className="text-black border border-black p-3 bg-indigo-200"
              >
                Add Another Storage Field
              </button>
              {inputCount?.storage > 1 && (
                <button
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
                  className="text-black border border-black p-3 bg-red-200"
                >
                  Remove Last Storage Field
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fabrication (nm)
              </label>
              <select
                name="fabrication"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Fabrication--</option>
                {filterValues?.fabrication &&
                  filterValues?.fabrication?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Core Count
              </label>
              <select
                name="corecount"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Core Count--</option>
                {filterValues?.corecount &&
                  filterValues?.corecount?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        );
      case "camera":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(inputCount?.backCamera)].map((_, i) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Back Camera (JSON)
                </label>
                <select
                  name="backCamera"
                  onChange={(e) => handleChangeArray(e, i)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">--Select Camera--</option>
                  {filterValues?.camera &&
                    filterValues?.camera?.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setInputCount((prev) => ({
                    ...prev,
                    backCamera: prev.backCamera + 1,
                  }))
                }
                className="text-black border border-black p-3 bg-indigo-200"
              >
                Add Another Back Field
              </button>
              {inputCount?.backCamera > 1 && (
                <button
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
                  className="text-black border border-black p-3 bg-red-200"
                >
                  Remove Last Back Field
                </button>
              )}
            </div>
            {[...Array(inputCount?.frontCamera)].map((_, i) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front Camera (JSON)
                </label>
                <select
                  name="frontCamera"
                  onChange={(e) => handleChangeArray(e, i)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">--Select Camera--</option>
                  {filterValues?.camera &&
                    filterValues?.camera?.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setInputCount((prev) => ({
                    ...prev,
                    frontCamera: prev.frontCamera + 1,
                  }))
                }
                className="text-black border border-black p-3 bg-indigo-200"
              >
                Add Another Front Field
              </button>
              {inputCount?.frontCamera > 1 && (
                <button
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
                  className="text-black border border-black p-3 bg-red-200"
                >
                  Remove Last Front Field
                </button>
              )}
            </div>
          </div>
        );
      case "connectivity":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(inputCount?.network)].map((_, i) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  name="network"
                  onChange={(e) => handleChangeArray(e, i)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">--Select Camera--</option>
                  {filterValues?.network &&
                    filterValues?.network?.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setInputCount((prev) => ({
                    ...prev,
                    network: prev.network + 1,
                  }))
                }
                className="text-black border border-black p-3 bg-indigo-200"
              >
                Add Another Network
              </button>
              {inputCount?.network > 1 && (
                <button
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
                  className="text-black border border-black p-3 bg-red-200"
                >
                  Remove Last Network
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bluetooth
              </label>
              <select
                name="bluetooth"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Bluetooth--</option>
                {filterValues?.bluetooth &&
                  filterValues?.bluetooth?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WiFi Version
              </label>
              <select
                name="wifiversion"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Wifi Version--</option>
                {filterValues?.wifiversion &&
                  filterValues?.wifiversion?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WiFi Type
              </label>
              <select
                name="wifitype"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Wifi Type--</option>
                {filterValues?.wifitype &&
                  filterValues?.wifitype?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                USB Type
              </label>
              <select
                name="usbtype"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select USB Type--</option>
                {filterValues?.usbtype &&
                  filterValues?.usbtype?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPS
              </label>
              <select
                name="gps"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NFC
              </label>
              <select
                name="nfc"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        );
      case "battery":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Battery Type
              </label>
              <select
                name="batterytype"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">--Select Type--</option>
                {filterValues?.batterytype &&
                  filterValues?.batterytype?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Battery Capacity (mAh)
              </label>
              <input
                name="batteryCapacity"
                placeholder="e.g., 5000"
                type="number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charging Support (w)
              </label>
              <input
                name="chargingSupport"
                placeholder="e.g., 65"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        );
      case "features":
        return (
          <div className="grid grid-cols-1 gap-6">
            {[
              { key: "ratings", display: "Ratings" },
              { key: "features", display: "Features" },
              { key: "general", display: "General" },
              { key: "table", display: "Table" },
            ].map((item) => (
              <div key={item.key}>
                {[...Array(inputCount[item.key])].map((_, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {item.display} (JSON)
                    </label>
                    <input
                      name={item.key}
                      placeholder="key,value"
                      onChange={(e) => handleChangeArrayObject(e, i)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                ))}
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setInputCount((prev) => ({
                        ...prev,
                        [item.key]: prev[item.key] + 1,
                      }))
                    }
                    className="text-black border border-black p-3 bg-indigo-200"
                  >
                    Add Another {item.display}
                  </button>
                  {inputCount[item.key] > 1 && (
                    <button
                      onClick={() => {
                        setInputCount((prev) => ({
                          ...prev,
                          [item.key]: prev[item.key] - 1,
                        }));
                        handleChangeArrayObject(
                          { target: { name: item.key, value: "" } },
                          inputCount[item.key] - 1
                        );
                      }}
                      className="text-black border border-black p-3 bg-red-200"
                    >
                      Remove Last {item.display}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {[...Array(inputCount?.pros)].map((_, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pros (JSON)
                </label>
                <input
                  name="pros"
                  placeholder="Great display"
                  onChange={(e) => handleChangeArray(e, i)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setInputCount((prev) => ({
                    ...prev,
                    pros: prev.pros + 1,
                  }))
                }
                className="text-black border border-black p-3 bg-indigo-200"
              >
                Add Another Pros
              </button>
              {inputCount?.pros > 1 && (
                <button
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
                  className="text-black border border-black p-3 bg-red-200"
                >
                  Remove Last Pros
                </button>
              )}
            </div>
            {[...Array(inputCount?.cons)].map((_, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cons (JSON)
                </label>
                <input
                  name="cons"
                  placeholder="Only 3GB RAM"
                  onChange={(e) => handleChangeArray(e, i)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setInputCount((prev) => ({
                    ...prev,
                    cons: prev.cons + 1,
                  }))
                }
                className="text-black border border-black p-3 bg-indigo-200"
              >
                Add Another Cons
              </button>
              {inputCount?.cons > 1 && (
                <button
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
                  className="text-black border border-black p-3 bg-red-200"
                >
                  Remove Last Cons
                </button>
              )}
            </div>
          </div>
        );
      case "media":
        return (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (g)
              </label>
              <input
                name="weight"
                placeholder="e.g., 205"
                type="number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                3.5mm Jack
              </label>
              <select
                name="threePointFive"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stereo Speakers
              </label>
              <select
                name="stereo"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FM Radio
              </label>
              <select
                name="fm"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
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
                    {images.length} files selected
                  </p>
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Phone Uploader
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Add a new phone to the database
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {renderTabContent()}

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                  </>
                ) : (
                  "Submit Phone"
                )}
              </button>
            </div>
          </form>
        </div>

        {response && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Response</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneUploader;
