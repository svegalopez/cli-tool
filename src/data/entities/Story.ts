import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'stories',
})
export class Story {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'launch_date' })
    launchDate!: string

    @Column({ unique: true })
    title!: string

    @Column()
    privacy!: boolean

    @Column()
    likes!: number
}

