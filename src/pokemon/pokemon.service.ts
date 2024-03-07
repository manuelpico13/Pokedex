import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as request from 'supertest';


@Injectable()
export class PokemonService {


constructor(
  
  @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>){}



  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      
      const Pokemon= await this.pokemonModel.create(createPokemonDto);
    return Pokemon;

    } catch (error) {
      if(error.code=== 11000){
        throw new BadRequestException(`Pokemon exist in db ${ JSON.stringify(error.keyvalue)} `)
      }
      
      console.log(error)
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)

    }
    
  }
  

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    if(!isNaN(+term)){

      pokemon = await this.pokemonModel.findOne({ no: term})

    }
//para buscar por nombre
    if(!pokemon && isValidObjectId( term )){

      pokemon = await this.pokemonModel.findById(term);

    }

    if (!pokemon){
      pokemon= await this.pokemonModel.findOne({name: term.toLowerCase()})
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${ term}" not found`);

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const Pokemon = await this.findOne(term);

    if(updatePokemonDto.name)
    updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    await Pokemon.updateOne(updatePokemonDto, {new: true});

    return { ...Pokemon.toJSON(), ...updatePokemonDto };
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
