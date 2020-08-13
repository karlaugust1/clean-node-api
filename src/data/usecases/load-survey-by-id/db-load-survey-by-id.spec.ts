import { SurveyModel } from "../../../domain/models/survey"
import { LoadSurveyByIdRepository } from "../../protocols/db/survey/load-survey-by-id-repository"
import { DbLoadSurveyById } from "./db-load-survey-by-id"
import MockDate from "mockdate"

const makeFakeSurvey = (): SurveyModel => ({
    id: "any_id",
    question: "any_question",
    answers: [{
        image: "any_image",
        answer: "any_answer"
    }],
    date: new Date()
})

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {

        // eslint-disable-next-line no-unused-vars
        async loadById(_id: string): Promise<SurveyModel> {
            return Promise.resolve(makeFakeSurvey())
        }

    }

    return new LoadSurveyByIdRepositoryStub()
}
type SutTypes = {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

    return {
        sut,
        loadSurveyByIdRepositoryStub
    }
}

describe("DbLoadSurveyById", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })

    test("Should call LoadSurveyByIdRepository", async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, "loadById")
        await sut.loadById("any_id")
        expect(loadByIdSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should return Survey on success", async () => {
        const { sut } = makeSut()
        const survey = await sut.loadById("any_id")
        expect(survey).toEqual(makeFakeSurvey())
    })
})