"use strict";
'use client'; // このディレクティブを追加
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const input_1 = require("@/components/ui/input");
const axios_1 = __importDefault(require("axios")); // axiosをインポート
function Home() {
    const [progress, setProgress] = React.useState(13); // プログレスバーの初期値を設定します
    const [text, setText] = React.useState(""); // テキスト入力欄の値を管理します
    const [corrections, setCorrections] = React.useState([]); // 添削結果の配列を管理します
    const [backendData, setBackendData] = React.useState(null); // バックエンドから取得したデータを管理します
    // プログレスバーの進捗を更新する副作用を設定します
    React.useEffect(() => {
        if (backendData) {
            const dataToShow = typeof backendData === "object" ? JSON.stringify(backendData) : backendData;
            setTextAreaValue(dataToShow);
        }
        else {
            setTextAreaValue("データがありません");
        }
    }, [backendData]);
    // テキスト入力欄の値が変更されたときに呼ばれるハンドラーを定義します
    const handleInputChange = (event) => {
        setText(event.target.value);
    };
    // バックエンドのAPIにGETリクエストを送信してデータを取得する関数を定義します
    const getData = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get("https://reprai-o3mmnjeefa-an.a.run.app/?text=今日は何をしましたか");
            setBackendData(response.data); // バックエンドから取得したデータをセットします
        }
        catch (error) {
            console.error(error);
        }
    });
    // バックエンドのデータをクリップボードにコピーする関数を定義します
    const copyBackendData = () => {
        if (backendData) {
            const dataToCopy = typeof backendData === "object" ? JSON.stringify(backendData) : backendData;
            navigator.clipboard.writeText(dataToCopy);
        }
    };
    // テキストエリアの値を設定する関数を定義します
    const setTextAreaValue = (value) => {
        const textArea = document.getElementById("outputTextArea");
        if (textArea) {
            textArea.value = value;
        }
    };
    return (<>
      {/* ヘッダー部分を定義します */}
      <div className="flex items-center justify-between w-full mb-4">
        <p className="text-lg font-bold text-black">repr <span className="text-orange-500">AI</span></p> {/* AI の部分をオレンジ色にします */}
        <p className="text-lg font-bold text-right">執筆する</p>
      </div>

      {/* メインコンテンツ部分を定義します */}
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center w-full">
          {/* テキスト入力欄を定義します */}
          <input_1.Input value={text} onChange={handleInputChange} className="w-full h-32 p-2 mb-4 border border-gray-300 rounded-md" // 幅を同じにするために mb-4 を追加
     style={{ paddingTop: "1px", paddingBottom: "90px" }} // プレースホルダーの位置を調整するスタイルを追加
     placeholder="テキストを入力してください"/>

          {/* テキストの文字数とコピーボタンを定義します */}
          <div className="flex items-center justify-between w-full bg-gray-100 rounded-md p-4 mb-4 text-sm text-gray-500">
            <p className="text-sm text-gray-500">文字数: {text.length}</p>
            {/* 人の絵文字を表示するボタン */}
            <button className="flex items-center text-white rounded-full px-3 py-1 mr-2 bg-transparent">
              <span role="img" aria-label="personal">👤</span>
            </button>
            {/* ニコちゃん絵文字を表示するボタン */}
            <button className="flex items-center text-white rounded-full px-3 py-1 mr-2 bg-transparent">
              <span role="img" aria-label="Niko-chan">😄</span>
            </button>
            {/* バックエンドのデータを取得するボタン */}
            <button onClick={getData} className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
              バックエンドデータ取得
            </button>
            {/* バックエンドのデータをコピーするボタン */}
            <button onClick={copyBackendData} className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center">
              コピー
            </button>
          </div>

          {/* 添削結果を表示するテキストエリアを定義します */}
          <textarea id="outputTextArea" placeholder="バックエンドから取得したデータがここに表示されます" className="w-full h-32 p-2 border border-gray-300 rounded-md" readOnly/>
        </div>
      </main>
    </>);
}
exports.default = Home;
