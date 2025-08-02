import prisma from "../../config/prismaClient.js";
import { ICreatePerson } from "../../models/person/ICreatePerson.js";
import * as clientType from "@prisma/client";
import { IPersonResult } from "../../models/person/IPersonResult.js";
import { IUpdatePersonData } from "../../models/person/IUpdatePersonData.js";

export async function createPerson(dataPerson: ICreatePerson): Promise<clientType.persons> {
    return await prisma.persons.create({
        data: {
            ...dataPerson
        },
    })
}

export async function getPersonById(personId: number): Promise<IPersonResult | null> {
    return await prisma.persons.findUnique({
        where: {
            id: personId
        },
        select: {
            id: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            date_of_birth: true,
            created_at: true
        }
    })
}

export async function updatePerson(personId: number, PersonData: IUpdatePersonData): Promise<IPersonResult> {
    return await prisma.persons.update({
        where: {
            id: personId
        },
        data: {
            ...PersonData
        },
        select: {
            id: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            date_of_birth: true,
            created_at: true
        }
    })
}

export async function deletePerson(personId: number) {
    await prisma.persons.delete({
        where: {
            id: personId
        }
    })
}