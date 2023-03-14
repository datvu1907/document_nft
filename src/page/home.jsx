import { useState } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Sepolia } from "@thirdweb-dev/chains";
import {
  useMetamask,
  useAddress,
  useMintNFT,
  useContract,
} from "@thirdweb-dev/react";
import axios from "axios";
function home() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [nftName, setNftName] = useState("");
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const { contract } = useContract(
    "0x5e2BAC00242aFA41f065C8C6F0Fb64Fb432f4008"
  );
  const { mutateAsync: mintNft, isLoading, error } = useMintNFT(contract);

  const handleImage = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsFilePicked(true);
    setImgUrl(URL.createObjectURL(e.target.files[0]));
  };
  const sendFileToIPFS = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "44fb5188f60a3dc8100b",
            pinata_secret_api_key:
              "89e8916a59f2dbbf2e92aa6905bf5db5defca1c7cf7068227fc71dd85398e9ef",
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        return ImgHash;
        //Take a look at your Pinata Pinned section, you will see a new file added to you list.
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
        return null;
      }
    }
  };
  const mint = async () => {
    const ipfsUrl = await sendFileToIPFS();
    if (ipfsUrl && selectedFile) {
      try {
        const data = await mintNft({
          metadata: {
            name: nftName,
            description: "This is NFT that is minted from a document",
            image: ipfsUrl,
          },
          to: address,
        });
        console.log("finished");
        console.log(data.reciept);
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <div class="bg-gray-200 h-full w-full m-0 py-0 ">
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-wrap justify-between gap-4">
            <div class="card__wrapper w-[24rem] p-6 text-center  rounded-lg bg-white shadow-lg">
              <h5 class="mb-2 text-xl bg-gray-100 p-2 rounded-lg  font-medium leading-tight text-neutral-800 ">
                Please Connect To Metamask
              </h5>

              <button
                className="w-full flex justify-center gap-x-4 items-center bg-[#44912d] text-white font-bold py-2 px-4 rounded-lg "
                onClick={connectWithMetamask}
              >
                <h1 className="truncate">
                  {address == null ? "Connect Metamask" : address}
                </h1>
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
                  value={nftName}
                  onInput={(e) => setNftName(e.target.value)}
                />

                <div class="flex items-center justify-center w-sm mt-2">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-sm border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6 min-h-something">
                      {isFilePicked ? (
                        <img src={imgUrl} />
                      ) : (
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            aria-hidden="true"
                            class="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            // xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p class="mb-2 text-sm text-gray-500">
                            <span class="font-semibold">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p class="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      class="hidden"
                      onChange={handleImage}
                    />
                  </label>
                </div>
              </div>
              <div class="my-1 py-2">
                {isFilePicked ? (
                  <p class="truncate">{selectedFile.name}</p>
                ) : (
                  <p class="truncate">Select a file to show details</p>
                )}
              </div>
              <button
                class="w-full justify-center gap-x-4 items-center bg-[#44912d] text-white font-bold py-2 px-4 rounded-lg inline-flex"
                onClick={mint}
              >
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

export default home;
