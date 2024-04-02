import { Injectable } from '@nestjs/common';
import { Axiosadapter } from 'src/common/adapters/axios.adapters';
import { Pokeresponse } from './interfaces/poke_response_interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';




@Injectable()
export class SeedService {



constructor( 
    @InjectModel(Pokemon.name)
private readonly pokemonModel: Model<Pokemon>, 
private readonly http: Axiosadapter,){}


  
async executeseed(){
    
    await this.pokemonModel.deleteMany();

const data = await this.http.get<Pokeresponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

const pokemontoinsert:{name:string,no:number}[]=[];
//mete a todo los pokemon en un array, y despues los inserta
const insertpromisesarray=[];

data.results.forEach(async({name,url})=>{

const segments=url.split('/');
const no:number =+segments[segments.length-2];

pokemontoinsert.push({name,no});

});

this.pokemonModel.insertMany(pokemontoinsert);

return 'Seed executed';

}

}
