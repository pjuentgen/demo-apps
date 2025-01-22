export interface Credentials {
    url: string;
    headers: {
        Authorization: string;
    }
};

export const credentials: Credentials = {
    url: process.env.NEXT_PUBLIC_OTLP_ENDPOINT!,
    headers: {
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OTLP_BEARER_TOKEN}`,
    }
};
