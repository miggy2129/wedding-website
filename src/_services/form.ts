"use server"
import { FormState } from "@/_types/rsvp";

type FormError = Error & { status?: number };

export async function postSubmit(formData: any) {
    try {
        const FORM_URL = process.env.APPSCRIPT_SECRET_URL;

        if (!FORM_URL) {
            throw new Error("Missing required ENV variable.");
        }

        const data: FormState = {
            name: formData["name"],
            email: formData["email"],
            phone: formData["phone"],
            invited: "YES",
            status: formData["status"],
            notes: formData["notes"],
            dietary: formData["dietary"],
            token: process.env.APPSCRIPT_SECRET_TOKEN
        };

        const response = await fetch(FORM_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            redirect: "follow"
        });
        
        const text = await response.text();
        const result = JSON.parse(text);
        
        if (result.status !== 200 || !response.ok) {
            return {
                success: false,
                status: result.status ?? response.status,
                message: result.message || 'Unknown error'
            }
        }

        return {
            success: true,
            status: result.status,
            message: result.message
        };
    } catch(error) {
        return {
            success: false,
            status: error instanceof Error && "status" in error ? (error as FormError).status : undefined,
            message: error instanceof Error ? error.message : String(error)
        };
    }
}