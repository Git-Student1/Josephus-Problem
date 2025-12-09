import {josProblem} from './josephus_problem';
import { expect, test } from 'vitest'
import {TestCase} from "vitest/node";

test('calculate josProblem with 9, 1', () => {
    expect(josProblem(9, 1).calculateResult()).toBe(3)
})

test('calculate josProblem with 41, 1', () => {
    expect(josProblem(41, 1).calculateResult()).toBe(19)
})

test('run josProblem with 9, 1', () => {
    expect(josProblem(9, 1).tryNextSteps()).toBe(3)
})

test('run josProblem with 41, 1', () => {
    expect(josProblem(41, 1).tryNextSteps()).toBe(19)
})

test('run josProblem with 10, 1', () => {
    expect(josProblem(10, 1).tryNextSteps()).toBe(5)
})

test('run josProblem with 10, 1', () => {
    let jos = josProblem(10, 1)
    while (jos.hasNext()){
        jos.next()
    }

    expect(jos.next().removed).toBe(5)
})


test('calculate josProblem with 9, 2', () => {
    expect(josProblem(9, 2).calculateResult()).toBe(1)
})

test('calculate josProblem with 41, 2', () => {
    expect(josProblem(41, 2).calculateResult()).toBe(31)
})

test('run josProblem with 9, 2', () => {
    expect(josProblem(9, 2).tryNextSteps()).toBe(1)
})

test('run josProblem with 41, 2', () => {
    expect(josProblem(41, 2).tryNextSteps()).toBe(31)
})