"use client";

import Link from "next/link";
import { useState } from "react";
import { rust_solve_linear_equations } from "@/pkg/project";

const MatrixPage = () => {
    const [coefficientMatrix, setCoefficientMatrix] = useState<number[][]>([[1, 1, 1], [2, 2, 1], [2, 3, 2]]);
    const [constantVector, setConstantVector] = useState<number[]>([0, 3, 1]);
    const [solutionVector, setSolutionVector] = useState<number[]>([2, 1, -3]);

    const handleChangeMatrix = (rowIndex: number, columnIndex: number, value: number) => {
        setCoefficientMatrix((prev) => prev.map((row, i) => i === rowIndex ? row.map((elm, j) => j === columnIndex ? value : elm) : row));
    };

    const handleChangeVector = (index: number, value: number) => {
        setConstantVector((prev) => prev.map((elm, i) => i === index ? value : elm));
    };

    const handleClickCalc = () => {
        // setSolutionVector(rust_solve_linear_equations(coefficientMatrix, new Float64Array(Array.from(constantVector))))
    };

    return (
        <div className="p-4 space-y-4">
            <div>
                <Link href="/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">← 戻る</Link>
            </div>
            <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">行列</h1>
            <div>
                <button
                    type="button"
                    className="
                        text-white bg-blue-700 hover:bg-blue-800
                        focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                        dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
                    "
                    onClick={handleClickCalc}
                >
                    計算
                </button>
            </div>
            <div className="flex space-x-4">
                <div>
                    <div>係数行列</div>
                    <table className="table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 border">A</th>
                                {coefficientMatrix[0].map((_, idx) => (
                                    <th key={idx} className="px-4 py-2 border">
                                        {idx + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {coefficientMatrix.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                    <th className="px-4 py-2 border bg-gray-200">
                                        {rowIdx + 1}
                                    </th>
                                    {row.map((elm, colIdx) => (
                                        <td key={colIdx} className="border">
                                            <input
                                                type="number"
                                                value={elm}
                                                onChange={(e) => handleChangeMatrix(rowIdx, colIdx, Number(e.target.value))}
                                                className="box-border px-4 py-2"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <div>定数ベクトル</div>
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border bg-gray-200">B</th>
                            </tr>
                        </thead>
                        <tbody>
                            {constantVector.map((elm, idx) => (
                                <tr key={idx}>
                                    <td className="border">
                                        <input
                                            type="number"
                                            value={elm}
                                            onChange={(e) => handleChangeVector(idx, Number(e.target.value))}
                                            className="box-border px-4 py-2"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <div>解ベクトル</div>
                <table>
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 border">x</th>
                            <th className="px-4 py-2 border">解</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solutionVector.map((elm, idx) => (
                            <tr key={idx}>
                                <th className="px-4 py-2 border bg-gray-200">x{idx + 1}</th>
                                <td className="px-4 py-2 border">{elm}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MatrixPage;