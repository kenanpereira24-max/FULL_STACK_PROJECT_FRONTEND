import React, { useState } from 'react';
import './App.css';

function PlanSelection({ onPlanSelect, readOnly }) {
  const [customValue, setCustomValue] = useState('');
  const [customUnit, setCustomUnit] = useState('TB');
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateCustomPrice = () => {
    if (!customValue || isNaN(customValue) || customValue <= 0) return 0;
    
    let totalTB = parseFloat(customValue);
    if (customUnit === 'PB') totalTB *= 1024;
    
    if (totalTB <= 1) return 15.00;

    let ratePerTB = 15;
    if (totalTB >= 1024) {
      ratePerTB = 12;
    } else {
      ratePerTB = 15 - ((totalTB - 1) / 1023) * 3;
    }

    return (totalTB * ratePerTB).toFixed(2);
  };

  const handleCustomValueChange = (e) => {
    const val = e.target.value;
    const maxVal = customUnit === 'PB' ? 1024 : 1048576;
    
    if (val !== '' && parseFloat(val) > maxVal) {
      alert("Maximum allowed custom storage is 1024 PB.");
      return;
    }
    
    setCustomValue(val);
    setIsCalculated(false);
  };

  const handleUnitChange = (e) => {
    setCustomUnit(e.target.value);
    setCustomValue('');
    setIsCalculated(false);
  };

  const handleCalculate = () => {
    let totalTB = parseFloat(customValue);
    if (customUnit === 'PB') totalTB *= 1024;

    if (!customValue || isNaN(customValue) || totalTB <= 1) {
      alert("Custom plans require storage strictly greater than 1 TB.");
      return;
    }
    
    setIsCalculated(true);
  };

  const handleCustomSelect = () => {
    let totalTB = parseFloat(customValue);
    if (customUnit === 'PB') totalTB *= 1024;

    if (!customValue || isNaN(customValue) || totalTB <= 1) {
      alert("Custom plans require storage strictly greater than 1 TB.");
      return;
    }

    if (totalTB > 1048576) {
      alert("Maximum allowed custom storage is 1024 PB.");
      return;
    }

    const price = calculateCustomPrice();
    onPlanSelect({
      name: `Custom`,
      storage: `${customValue} ${customUnit}`,
      price: `$${price}/mo`
    });
  };

  const plans = [
    { name: 'Free Plan', storage: '20 GB', price: '$0/mo' },
    { name: 'Upgrade 1', storage: '256 GB', price: '$5/mo' },
    { name: 'Upgrade 2', storage: '512 GB', price: '$9/mo' },
    { name: 'Pro', storage: '1 TB', price: '$15/mo' }
  ];

  return (
    <div className="plan-container">
      <h2 className="plan-title">{readOnly ? "Our Pricing Plans" : "Choose Your Storage Plan"}</h2>
      <div className="plan-grid">
        {plans.map((plan) => (
          <div key={plan.name} className="plan-card">
            <h3>{plan.name}</h3>
            <p className="plan-storage">{plan.storage}</p>
            <p className="plan-price">{plan.price}</p>
            {!readOnly && (
              <button className="plan-button" onClick={() => onPlanSelect(plan)}>
                Select {plan.name}
              </button>
            )}
          </div>
        ))}
        
        <div className="plan-card plan-custom">
          <h3>Custom</h3>
          <div className="plan-custom-wrapper">
            <input
              type="number"
              min="1.1"
              step="0.1"
              value={customValue}
              onChange={handleCustomValueChange}
              placeholder="Amount"
              className="plan-input"
            />
            <select value={customUnit} onChange={handleUnitChange} className="plan-select">
              <option value="TB">TB</option>
              <option value="PB">PB</option>
            </select>
          </div>
          <p className="plan-price">
            Calculated Price: ${readOnly && !isCalculated ? '0.00' : calculateCustomPrice()}/mo
          </p>
          
          {readOnly ? (
            <button className="plan-button" onClick={handleCalculate}>
              Calculate
            </button>
          ) : (
            <button className="plan-button" onClick={handleCustomSelect}>
              Select Custom Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanSelection;