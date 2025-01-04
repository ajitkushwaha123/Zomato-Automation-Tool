import React, { useRef, useState } from "react";

export default function Otp({ otpEntered }) {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (
      !/^[0-9]$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        "",
        ...prevOtp.slice(index + 1),
      ]);
      if (e.key === "Backspace" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        value,
        ...prevOtp.slice(index + 1),
      ]);

      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    otpEntered(
      [...otp.slice(0, index), value, ...otp.slice(index + 1)].join("")
    );
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").slice(0, otp.length);
    if (/^\d+$/.test(text)) {
      const digits = text.split("");
      setOtp((prevOtp) => [
        ...digits,
        ...prevOtp.slice(digits.length, otp.length),
      ]);
      digits.forEach((_, i) => {
        inputRefs.current[i]?.focus();
      });
      otpEntered(digits.join(""));
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <section className="bg-white pb-6 dark:bg-dark">
      <div className="container">
        <div>
          <p className="mb-1.5 text-sm font-medium text-dark dark:text-white">
            Secure code
          </p>
          <form id="otp-form" className="flex gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={handleFocus}
                ref={(el) => (inputRefs.current[index] = el)}
                className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-xl font-semibold text-[#424242] text-gray-5 outline-none sm:text-3xl dark:border-dark-3 dark:bg-white/5"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </form>
        </div>
      </div>
    </section>
  );
}
