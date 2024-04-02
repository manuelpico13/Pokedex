import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParsemongoidPipe } from 'src/common/pipe/parsemongoid/parsemongoid.pipe';
import { PaginationDto } from 'src/common/DTO/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(@Query() paginationdto: PaginationDto) {

    return this.pokemonService.findAll(paginationdto)
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update( term, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParsemongoidPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
