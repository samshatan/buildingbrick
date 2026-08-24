// @desc    Get configuration data including fees
// @route   GET /api/v1/config/fees
// @access  Public
export const getFeesConfig = async (req, res) => {
  try {
    // Currently hardcoded here to centralize it. 
    // In the future, this can be fetched from a database collection if you build an Admin Dashboard.
    const fees = {
      labour: 19,
      contractor: 99,
      seller: 0
    };
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
