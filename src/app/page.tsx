"use client";

import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react"; // useStateとuseEffectを追加
import { Button } from "@/components/ui/button";
import { BookCopy } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

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

export default function Home() {
  const [backendData, setBackendData] = useState<any>(null);
  const [text, setText] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態を管理
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (backendData) {
      const dataToShow =
        typeof backendData === "object"
          ? JSON.stringify(backendData)
          : backendData;
      setTextAreaValue(dataToShow);
    } else {
      setTextAreaValue("データがありません");
    }
  }, [backendData]);

  const getData = async () => {
    try {
      setLoading(true); // データ取得開始時にローディングを開始
      const response = await axios.get(
        `https://reprai-o3mmnjeefa-an.a.run.app/?text=${JSON.stringify(text)}`
      );
      setBackendData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // データ取得終了時にローディングを停止
    }
  };

  const copyFixedData = () => {
    if (backendData) {
      const dataToCopy =
        typeof backendData === "object"
          ? JSON.stringify(backendData)
          : backendData;
      navigator.clipboard.writeText(dataToCopy);
      setCopied(true);
      // 2秒後に元に戻す
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  const setTextAreaValue = (value: any) => {
    const textArea = document.getElementById(
      "outputTextArea"
    ) as HTMLTextAreaElement | null;
    textArea?.setAttribute("value", value);
  };

  return (
    <>
      <div className="flex items-center justify-between w-full mb-4">
        <p className="text-lg font-bold text-black">
          repr <span className="text-orange-500">AI</span>
        </p>
        <p className="text-lg font-bold text-right">執筆する</p>
      </div>
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
            <Button onClick={getData} disabled={loading}>
              {loading ? <LoadingSpinner /> : "修正"}{" "}
              {/* ローディング中はスピナーを表示 */}
            </Button>
            <Button onClick={copyFixedData}>
              {copied ? <Check /> : <BookCopy />}
            </Button>
          </div>
          <Textarea
            id="outputTextArea"
            placeholder="修正例はここ"
            value={
              backendData && backendData.fixes.length
                ? backendData.fixes.map((fix: any) => fix.fixed).join("\n")
                : "データがありません"
            }
            readOnly
          />
        </div>
      </main>
    </>
  );
}
