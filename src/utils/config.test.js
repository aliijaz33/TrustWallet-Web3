import { ETH_RPC_URL } from './config';

console.log('TrustWallet Config Test:');
console.log('ETH_RPC_URL:', ETH_RPC_URL);

// Test if environment variables are loading
export const testConfig = () => {
  if (ETH_RPC_URL) {
    console.log('✅ Environment config loaded successfully');
    return true;
  } else {
    console.log('❌ Environment config failed to load');
    return false;
  }
};

export default testConfig;
