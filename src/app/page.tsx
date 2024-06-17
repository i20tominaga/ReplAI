'use client';

import * as React from "react";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookCopy, SendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BackendData {
  score: {
    politeness: number;
    readability: number;
  };
  fixes: {
    fixed: string;
  }[];
}

const LoadingSpinner = () => <div className="loader">修正中...</div>;

export default function Home() {
  const [backendData, setBackendData] = useState<BackendData | null>(null);
  const [text, setText] = useState<string>(""); // 初期値を空文字列に設定
  const [outputText, setOutputText] = useState<string>("修正例はここ");
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async () => {
    const requestStartTime = Date.now(); // リクエスト開始時間を記録
    try {
      setLoading(true);
      const response = await axios.get(
        `https://reprai-o3mmnjeefa-an.a.run.app/?text=${JSON.stringify(text)}`
      );
      const responseTime = Date.now() - requestStartTime; // レスポンスタイムを計算
      console.log(`Total response time: ${responseTime} ms`);

      setBackendData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("リクエストが失敗しました", {
        autoClose: false,
        closeButton: false,
        onClick: () => getData(),
      });
    } finally {
      setLoading(false);
    }
  }, [text]);

  const copyFixedData = () => {
    if (backendData && backendData.fixes) {
      const fixes = backendData.fixes.map((fix) => fix.fixed).join("\n");
      navigator.clipboard.writeText(fixes);
      toast.success("コピーが成功しました！");
    }
  };

  useEffect(() => {
    if (backendData && backendData.fixes.length) {
      setOutputText(backendData.fixes.map((fix) => fix.fixed).join("\n"));
    } else {
      setOutputText("修正例はここ");
    }
  }, [backendData]);

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
          <>{outputText}</>
        </div>
      </main>
    </>
  );
}
