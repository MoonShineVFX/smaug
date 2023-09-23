
import { z, ZodTypeAny } from 'zod';
const util = {
    /**
     * @param {number} bytes
     * @return {number} - 小數兩位
     */
formatBytes:(bytes: number, decimals = 2) => {

        if (bytes === 0) return '0B';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;


    }
}
export default util;


export const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: 'Nombre Invalide',
    })
    .transform((value) => (value === null ? 0 : Number(value)))
    .pipe(zodPipe);