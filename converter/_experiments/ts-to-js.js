// via https://twitter.com/wesbos/status/1613634253786386449
import { transformSync } from '@swc/core'

const maybes = `
interface User {
  name: string;
  id: number;
}
 
class UserAccount {
  name: string;
  id: number;
 
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
 
const user: User = new UserAccount("Murphy", 1);
`


try {
  const output = transformSync(maybeTs, {
    jsc: {
      parser: {
        syntax: 'typescript',
        target: 'es2022'
      }
    }
  })
  console.log(output.code)
} catch (err) {
  console.log(err);
}

