import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {


    try {
        await db.transaction(async (tx) => {

        });

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch" },
            { status: 500 },
        );
    }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {


    try {
        await db.transaction(async (tx) => {

        });

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update" },
            { status: 500 },
        );
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {


    try {
        await db.transaction(async (tx) => {

        });

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 },
        );
    }
};
