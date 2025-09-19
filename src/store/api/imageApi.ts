import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    convertImage: builder.mutation<
      { blob: Blob; filename: string },
      {
        file: File;
        format: string;
        width?: number;
        height?: number;
        quality: number;
      }
    >({
      query: ({ file, format, width, height, quality }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);
        formData.append('quality', quality.toString());
        if (width) formData.append('width', width.toString());
        if (height) formData.append('height', height.toString());

        return {
          url: '/convert',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: async (response: Response) => {
        const blob = await response.blob();
        const filename =
          response.headers.get('Content-Disposition')?.split('filename=')[1] ||
          'converted';
        return { blob, filename };
      },
    }),
  }),
});

export const { useConvertImageMutation } = imageApi;
