export default {
  calculateTheoricalMean(testNames, testPercentages, uc, date, csv, output) {
    let tests = testNames.split(',')
    let tests_percentage = testPercentages.split(',')
    output.push([`U.C de ${uc} - Ano Letivo ${date}`])
    let outputHeaders = [csv.headers[0], csv.headers[1], 'Av. Teórica']
    output.push(outputHeaders)
    let grade
    for (let i = 0; i < csv[csv.headers[0]].length; i++) {
      let mean_t = parseFloat('0')
      for (let k = 0; k < tests.length; k++) {
        if (!isNaN(csv[tests[k]][i])) {
          mean_t += parseFloat(csv[tests[k]][i]) * parseFloat(tests_percentage[k])
        }
      }

      grade = mean_t.toFixed(2)
      output.push([csv[csv.headers[0]][i], csv[csv.headers[1]][i], grade])
    }
  },
  calculatePraticalMean(jobNames, jobPercentages, uc, date, output, csv) {
    let jobs = jobNames.split(',')
    let jobs_percentage = jobPercentages.split(',')
    output.push([`U.C de ${uc} - Ano Letivo ${date}`])
    let outputHeaders = [csv.headers[0], csv.headers[1], 'Av. Prática']
    output.push(outputHeaders)
    let grade

    for (let i = 0; i < csv[jobs[0]].length; i++) {
      let mean_p = parseFloat('0')
      for (let j = 0; j < jobs.length; j++) {
        if (csv[jobs[j]][i].includes(',')) csv[jobs[j]][i] = csv[jobs[j]][i].replace(',', '.')

        if (!isNaN(csv[jobs[j]][i])) {
          mean_p += parseFloat(csv[jobs[j]][i]) * parseFloat(jobs_percentage[j])
        }
      }
      grade = mean_p.toFixed(2)
      output.push([csv[csv.headers[0]][i], csv[csv.headers[1]][i], grade])
    }
  },
  calculateFinalMean(
    jobNames,
    jobPercentages,
    testNames,
    testPercentages,
    output,
    uc,
    date,
    csv,
    pMinGrade,
    tMinGrade,
    t_evaluation_percentage,
    p_evaluation_percentage
  ) {
    let jobs = jobNames.split(',')
    let jobs_percentage = jobPercentages.split(',')
    let tests = testNames.split(',')
    let tests_percentage = testPercentages.split(',')
    let pGrade, tGrade, grade

    output.push([`U.C de ${uc} - Ano Letivo ${date}`])
    let outputHeaders = [csv.headers[0], csv.headers[1], 'Av. Prática', 'Av. Teórica', 'Av. Final']
    output.push(outputHeaders)

    for (let i = 0; i < csv[jobs[0]].length; i++) {
      let mean_p = parseFloat('0')
      let mean_t = parseFloat('0')
      for (let j = 0; j < jobs.length; j++) {
        if (csv[jobs[j]][i].includes(',')) csv[jobs[j]][i] = csv[jobs[j]][i].replace(',', '.')
        if (!isNaN(csv[jobs[j]][i])) {
          mean_p += parseFloat(csv[jobs[j]][i]) * parseFloat(jobs_percentage[j])
        }
      }
      for (let k = 0; k < tests.length; k++) {
        if (!isNaN(csv[tests[k]][i])) {
          mean_t += parseFloat(csv[tests[k]][i]) * parseFloat(tests_percentage[k])
        }
      }

      if (pMinGrade == 0) {
        pGrade = mean_p.toFixed(2)
      } else {
        pGrade = mean_p < pMinGrade ? mean_p.toFixed(2) + ' (R)' : mean_p.toFixed(2)
      }

      tGrade = mean_t < tMinGrade ? mean_t.toFixed(2) + ' (R)' : mean_t.toFixed(2)
      if (isNaN(pGrade) || isNaN(tGrade)) grade = 'R'
      else {
        let aux = mean_t * parseFloat(t_evaluation_percentage) + mean_p * parseFloat(p_evaluation_percentage)
        grade = aux < tMinGrade ? aux.toFixed(0) + ' (R)' : aux.toFixed(0)
      }

      output.push([csv[csv.headers[0]][i], csv[csv.headers[1]][i], pGrade, tGrade, grade])
    }
  },
  orderById(arr) {
    let len = arr.length
    for (let i = 1; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        if (arr[i].split(this.separator)[0] > arr[j].split(this.separator)[0]) {
          let aux = arr[i]
          arr[i] = arr[j]
          arr[j] = aux
        }
      }
    }
  },
  createJSON(arr, header, csv, separator) {
    for (let str of header) {
      csv[str] = []
      if (csv.headers) csv.headers.push(str)
      else csv.headers = [str]
    }

    for (let i = 1; i < arr.length; i++) {
      let arr2 = arr[i].split(separator)
      for (let j = 0; j < arr2.length; j++) {
        csv[header[j]].push(arr2[j])
      }
    }
  },
  updateJSON(arr, header, csv, separator) {
    if (csv[csv.headers[0]].length < arr.length) {
      let newStruct = this.checkUsers(arr, csv, separator)
      csv.headers = newStruct[0]
      for (let i = 0; i < newStruct[0].length; i++) {
        csv[newStruct[0][i]] = []
        for (let j = 1; j < newStruct.length; j++) {
          csv[newStruct[0][i]].push(newStruct[j][i])
        }
      }
    } else {
      for (let i = 0; i < header.length && csv.headers.length; i++) {
        if (!csv.headers.includes(header[i])) {
          csv[header[i]] = []
          for (let j = 0; j < csv[header[0]].length; j++) {
            csv[header[i]].push('0')
          }
          csv.headers.push(header[i])
        }
      }
      for (let j = 1; j < arr.length; j++) {
        let arr2 = arr[j].split(separator)
        for (let k = 2; k < arr2.length; k++) {
          let newId = arr2[0]
          let index = csv[header[0]].findIndex(x => x === newId)
          let newVal = arr2[k]
          if (index !== undefined) {
            csv[header[k]][index] = newVal
          }
        }
      }
    }
  },
  checkUsers(arr, csv, separator) {
    let newStruct = [arr[0].split(separator)]
    let len = arr.length
    for (let i = 1; i < arr.length; i++) {
      newStruct.push(arr[i].split(separator))
    }

    for (let j = 2; j < csv.headers.length; j++) {
      let newHeader = csv.headers[j]
      newStruct[0].push(newHeader)
      let c = 0
      for (let k = 1; k < len; k++) {
        let val = csv[newHeader][c]
        if (val != undefined) {
          if (csv[csv.headers[0]][c] == newStruct[k][0]) {
            newStruct[k].push(val)
            c++
          } else newStruct[k].push('0')
        } else newStruct[k].push('0')
      }
    }
    return newStruct
  },
  findHeader(arr, separator) {
    const firstLine = arr[0].split(separator).length,
      len = arr.length
    let line = 1
    for (; line < len; line++) {
      if (firstLine < arr[line].split(separator).length) return arr.slice(line, len)
    }
    return arr
  },
}
