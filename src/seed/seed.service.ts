import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Pokeresponse } from './interfaces/poke_response_interface';
import { log } from 'console';


@Injectable()
export class SeedService {

private readonly axios:AxiosInstance=axios;
  
async executeseed(){
    
const { data } = await this.axios.get<Pokeresponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

data.results.forEach(({name,url})=>{

const segments=url.split('/');
const no:number =+segments[segments.length-2];

console.log(name,no);


})

return data.results;

}

}
