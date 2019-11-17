import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1574009650568 implements MigrationInterface {
    name = 'initial1574009650568'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `stories` (`id` int NOT NULL AUTO_INCREMENT, `launch_date` date NOT NULL, `title` varchar(255) NOT NULL, `privacy` varchar(32) NOT NULL, `likes` int NOT NULL, UNIQUE INDEX `IDX_18e913d264452630f78e9209e8` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_18e913d264452630f78e9209e8` ON `stories`", undefined);
        await queryRunner.query("DROP TABLE `stories`", undefined);
    }

}
