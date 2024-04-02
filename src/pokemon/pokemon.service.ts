import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as request from 'supertest';
import { PaginationDto } from '../common/DTO/pagination.dto';
import { Console } from 'console';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PokemonService {

  private defaultlimit:number;

constructor(
  
  @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>,
  
  private readonly configservice: ConfigService

  ){

    this.defaultlimit=configservice.get<number>('defaultlimit')
    
  }



  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      
      const Pokemon= await this.pokemonModel.create(createPokemonDto);
    return Pokemon;

    } catch (error) {
      this.handleExceptions(error);

    }
    
  }
  

  findAll(PaginationDto: PaginationDto) {

    const {limit=this.defaultlimit,offset=0}=PaginationDto

    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no:1
    })
    .select('-__v');

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
    try {
      
      const Pokemon= await this.pokemonModel.updateOne(updatePokemonDto);
    return Pokemon;

    } catch (error) {
      this.handleExceptions(error);
    }

    return { ...Pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    /*const Pokemon= await this.findOne(id);

    await Pokemon.deleteOne();

    throw console.log(`El Pokemon ${Pokemon.name} fue borrado correctamente`);*/

    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0)
    throw new BadRequestException(`Pokemon with id "${id}" not found`)
  }

    private handleExceptions( error: any ) {
      if ( error.code === 11000 ) {
        throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
      }
      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
    }

  }
