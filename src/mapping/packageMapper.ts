import { IPackagesDto } from "../models/package/IPackagesDto.js";
import { IPackageBasicDto } from "../models/package/IPackageBasicDto.js";

export function mapPackageToDto(packageObj: IPackagesDto): IPackageBasicDto {
    return {
        id: packageObj.id,
        name: packageObj.name,
        description: packageObj.description,
        price: packageObj.price,
        duration_in_days: packageObj.duration_in_days
    };
}

export function mapPackagesToDto(packages: IPackagesDto[]): IPackageBasicDto[] {
    return packages.map(mapPackageToDto);
}
