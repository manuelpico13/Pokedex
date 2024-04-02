import { Module } from '@nestjs/common';
import { Axiosadapter } from './adapters/axios.adapters';

@Module({
    providers: [Axiosadapter],
    exports: [Axiosadapter]
})
export class CommonModule {}
