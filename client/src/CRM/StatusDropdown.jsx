import { useState } from "react";
import Select from "react-select";

const StatusDropdown = ({ selectedStatus, statusOptions }) => {
  const options = statusOptions?.map((status) => ({
    value: status?.uid,
    label: status?.title,
  }));

  const [selectedOptions, setSelectedOptions] = useState([]);
  selectedStatus(selectedOptions);

  const getDisplayValue = () => {
    if (selectedOptions.length > 2) {
      return [
        { label: `${selectedOptions.length} selected`, value: "summary" },
      ];
    }
    return selectedOptions;
  };

  return (
    <div className="w-full mb-4 mr-4">
      <Select
        isMulti
        options={options}
        value={getDisplayValue()}
        onChange={setSelectedOptions}
        className="w-full"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#1F2937",
            color: "white",
            borderColor: "#4B5563",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#1F2937",
            color: "white",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#4B5563" : "#1F2937",
            color: "white",
            "&:hover": {
              backgroundColor: "#374151",
            },
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#4B5563",
            color: "white",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "white",
          }),
        }}
      />
    </div>
  );
};

export default StatusDropdown;
