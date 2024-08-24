import Image from "next/image";
import { useState } from "react";
import Modal from "react-modal";
import QrCodeViewer from "./qr-code/qr-code-viewer";
import { useWriteContract } from "wagmi";

const modalStyle = {
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  content: {
    top: "5rem",
    left: "5rem",
    right: "5rem",
    bottom: "5rem",
    backgroundColor: "rgba(0,39,243)",
    borderRadius: "2rem",
    padding: "1.5rem",
  },
};

export default function WalletAddressField({ address }: { address: string }) {
  const { data: hash, isPending, writeContract } = useWriteContract();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");

  /**
   * モーダルをオープンする前に秘密鍵を生成する
   */
  const isModalOpen = () => {
    // 暗号化方式はシーザー暗号を使用
    // 1~25の乱数を生成
    const random = Math.floor(Math.random() * 25) + 1;
    const _secretKey = random.toString();
    setSecretKey(_secretKey);
    setIsOpen(true);

    // TODO: ここでコントラクトに秘密鍵を送信する処理を実装
    console.log("Register Receiver SecretKey", secretKey);
    // writeContract({
    //   address: address,
    //   abi: abi, // TODO: 変更の可能性あり
    //   functionName: "registerKey", // TODO: 変更の可能性あり
    //   args: [_secretKey],
    // });
  };

  return (
    <form className="w-full max-w-sm">
      <div className="flex items-center border-b border-teal-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          value={address}
          placeholder="test.zkpayuser.eth"
          disabled
        />
        <div className="cursor-pointer hover:scale-110 transform transition duration-500 ease-in-out">
          <Image
            width="40"
            height="40"
            src={"/mage_qr-code.png"}
            alt="qr_icon"
            onClick={() => isModalOpen()}
          ></Image>
          <Modal
            isOpen={modalIsOpen}
            style={modalStyle}
            onRequestClose={() => setIsOpen(false)}
          >
            <button
              type="button"
              className="ms-auto -mx-1.5 -my-1.5  text-white hover:text-gray-500 rounded-full focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              data-dismiss-target="#toast-default"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>

            <div className="mt-10 flex justify-center text-center">
              <QrCodeViewer
                address={address}
                secretKey={secretKey}
              ></QrCodeViewer>
            </div>
          </Modal>
        </div>
      </div>
    </form>
  );
}
