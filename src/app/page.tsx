"use client";
import * as React from "react";
import axios from "axios";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BookCopy, SendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer, ToastContentProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ParagraphElement {
  type: "paragraph";
  children: CustomText[];
}

interface CustomText {
  text: string;
}

type CustomElement = ParagraphElement;
declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
    Text: CustomText;
  }
}

type Props = {
  text?: string;
  setText: (text: string) => void;
};

const LoadingSpinner = () => <div className="loader">修正中...</div>;

const RetryToast = ({ closeToast, retry }: { closeToast: () => void, retry: () => void }) => (
  <div>
    <p>リクエストが失敗しました。</p>
    <Button onClick={() => { retry(); closeToast(); }} className="bg-blue-500 hover:bg-blue-600">
      再試行する
    </Button>
  </div>
);

export default function Home() {
  const [backendData, setBackendData] = useState<any>(null);
  const [text, setText] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://reprai-o3mmnjeefa-an.a.run.app/?text=${JSON.stringify(text)}`
      );
      setBackendData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (retryCount < 3) { // Retry up to 3 times
        setTimeout(() => {
          toast.info("レスポンスがありません。再試行中...", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          getData(retryCount + 1);
        }, 2000); // Wait 2 seconds before retrying
      } else {
        toast(
          <RetryToast retry={() => getData(0)} closeToast={() => toast.dismiss()} />,
          {
            position: "top-right",
            autoClose: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setLoading(false);
      }
    }
  }, [text]);

  const copyFixedData = () => {
    if (backendData && backendData.fixes) {
      const fixes = backendData.fixes.map((fix: any) => fix.fixed).join("\n");
      navigator.clipboard.writeText(fixes);
      toast.success("コピーが成功しました！", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-between w-full mb-4">
        <p className="text-lg font-bold text-black">
          repr <span className="text-orange-500">AI</span>
        </p>
        <p className="text-lg font-bold text-right">執筆する</p>
      </div>
      <a href="https://www.tokuyama.ac.jp/" className="text-lg text-gray-500">説明ページはこちら</a>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center w-full">
          <Textarea
            placeholder="入力してください"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div
            className="flex items-center justify-between w-full bg-gray-100 rounded-md p-4 mb-4 text-sm text-gray-500"
            style={{ marginTop: "1rem" }}
          >
            <p className="text-sm text-gray-500">
              文字数: {text ? text.replace(/\n/g, "").length : 0}
            </p>
            <button
              className="flex items-center text-white rounded-full px-3 py-1 mr-2 bg-transparent"
              style={{ width: "2rem" }}
            >
              <span role="img" aria-label="personal">
                👤
              </span>
              <span style={{ color: "black" }}>
                :{backendData ? backendData.score.politeness : "-"}
              </span>
            </button>
            <button
              className="flex items-center text-white rounded-full px-3 py-1 mr-2 bg-transparent"
              style={{ width: "2rem" }}
            >
              <span role="img" aria-label="Niko-chan">
                😄
              </span>
              <span style={{ color: "black" }}>
                :{backendData ? backendData.score.readability : "-"}
              </span>
            </button>
            <Button onClick={copyFixedData}>
              <BookCopy />
            </Button>
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => getData()} disabled={loading}>
              {loading ? <LoadingSpinner /> : <SendHorizontal />}
            </Button>
          </div>
          <Textarea
            id="outputTextArea"
            placeholder="修正例はここ"
            value={
              backendData && backendData.fixes.length
                ? backendData.fixes.map((fix: any) => fix.fixed).join("\n")
                : "修正例はここ"
            }
            readOnly
          />
        </div>
      </main>
    </>
  );
}
