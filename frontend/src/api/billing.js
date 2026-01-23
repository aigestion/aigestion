/**
 * 🏢 AIGestion Billing API Client
 */

export const fetchBillingData = async () => {
  // In a real scenario, this calls the backend endpoint.
  // For this God-Mode demo, we'll simulate the response based on the snapshot logic.

  try {
    // Attempt real fetch if endpoint exists
    const response = await fetch('/api/billing/snapshot');
    if (response.ok) return await response.json();
  } catch (e) {
    // Fallback Mock
  }

  return {
    updatedAt: new Date().toISOString(),
    googleCloudUSD: 50.50,
    vercelUSD: 35.50,
    otherUSD: 12.00,
    ivaRate: 0.21,
    totalUSD: 118.58, // (50.5+35.5+12) * 1.21
    currency: 'EUR',
    totalEUR: 108.79
  };
};
