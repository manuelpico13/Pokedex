import axios ,{ AxiosInstance } from "axios";
import { Httpadapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Axiosadapter implements Httpadapter{

    private readonly axios:AxiosInstance=axios;

    async get<T>(url: string): Promise<T> {
        try {
            const {data} = await this.axios.get<T>(url);

            return data
        } catch (error) {
            throw new Error('This is an error- Check logs');
        }
    }

}