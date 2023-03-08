import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./page/home";
import "./App.css";

function App() {
  const [accounts, setAccounts] = useState([0]);
  async function handleSubmit() {
    const chainId = 11155111; // Sepolia Testnet
    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(chainId) }],
        });
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Sepolia Test Netwok",
                chainId: web3.utils.toHex(chainId),
                nativeCurrency: {
                  name: "Ethereum",
                  decimals: 18,
                  symbol: "ETH",
                },
                rpcUrls: [
                  "https://sepolia.infura.io/v3/defcafe95f8c4ab4b176beaf8054b766",
                ],
              },
            ],
          });
        }
      }
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // setAccounts(account);
      setAccounts(account[0]);
    }
  }

  return (
    <div class="bg-gray-200 mx-0 my-0 p-0">
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-wrap justify-between gap-4">
            <div class="card__wrapper w-[24rem] p-6 text-center  rounded-lg bg-white shadow-lg">
              <h5 class="mb-2 text-xl bg-gray-100 p-2 rounded-lg  font-medium leading-tight text-neutral-800 ">
                Please Connect To Metamask
              </h5>

              <button
                className="w-full flex justify-center gap-x-4 items-center bg-[#44912d] text-white font-bold py-2 px-4 rounded-lg"
                onClick={handleSubmit}
              >
                {accounts == 0 ? "Connect Metamask" : account}
              </button>
            </div>

            <div class="card__wrapper w-[24rem] text-center  rounded-lg bg-white shadow-lg p-6">
              <h5 class="mb-2 text-xl bg-gray-100 p-2 rounded-lg  font-medium leading-tight text-neutral-800 ">
                Upload A Document To Convert It Into NFT And Give It A Name
              </h5>

              <div class="my-8">
                <input
                  type="text"
                  id="full-name"
                  name="full-name"
                  class="w-full bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="Name"
                />

                <div class="flex items-center justify-center w-sm mt-2">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-sm border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        class="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p class="mb-2 text-sm text-gray-500">
                        <span class="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p class="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" class="hidden" />
                  </label>
                </div>
              </div>

              <button class="w-full justify-center gap-x-4 items-center bg-[#44912d] text-white font-bold py-2 px-4 rounded-lg inline-flex">
                {" "}
                Mint{" "}
              </button>
            </div>

            <div class="card__wrapper w-[24rem] text-center  rounded-lg bg-white shadow-lg p-6">
              <h5 class="mb-2 text-xl bg-gray-100 p-2 rounded-lg  font-medium leading-tight text-neutral-800 ">
                Send NFT To An Address
              </h5>

              <div class="my-8">
                <input
                  type="text"
                  id="full-name"
                  name="full-name"
                  class="w-full bg-gray-100 bg-opacity-50 rounded-lg border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="Recipient Address"
                />
              </div>

              <button class="w-full justify-center gap-x-4 items-center bg-[#44912d] text-white font-bold py-2 px-4 rounded-lg inline-flex">
                {" "}
                Send{" "}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
