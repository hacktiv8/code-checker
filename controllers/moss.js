// const GithubRepo = require('../models/githubrepo')

class MossController {
  static async generateMossResults(results, config){
    return new Promise(async (success, fail) => {
      const resultsCount = results.length
      let counter = 1
  
      console.log()
      console.log(`Begin generating second opinion results from MOSS...`)
  
      let mossURLs = await Promise.all(results.map(async result => {
        try {
          let mossOutput = execSync(`./moss -l javascript ./${config.repoBranchOutputDir}/${result.Student1.branch}.js ./${config.repoBranchOutputDir}/${result.Student2.branch}.js`, { encoding: 'utf8' })
          mossOutput = mossOutput.split('\n')
  
          console.log(`Generated case ${counter} of ${resultsCount}`)
          console.log(`URL: ${mossOutput[mossOutput.length - 2]}`)
  
          return mossOutput[mossOutput.length - 2]
        } catch (e) {
          console.error(e)
        } finally {
          counter += 1
        }
      }))
  
      fsSync.writeFileSync(`results/${config.batch_name}/moss-${config.repo.name}.json`, JSON.stringify(mossURLs, null, 2))
      
      success(`MOSS results retrieved and saved in results/moss-${config.repo.name}.json!`)
    })
	}
	
  // static async resubmitNulls(){
  //   console.time('Completed! Time needed for completion was')
  //   let conf = {}
    
  //   GithubRepo.getConfig()
  //   .then(config => {
  //     Object.assign(conf, { ...config })
  //     return GithubRepo.getPhaseRepos(conf)
  //   })
  //   .then(phaseRepos => {
  //     conf.phaseRepos = JSON.parse(phaseRepos)[`w${conf.week}d${conf.day}`][0]
  //     conf.basePath = {
  //       merged: `results/${conf.batch_name}/merged/${conf.repo.name}.json`,
  //     }

  //     if(fsSync.existsSync(conf.basePath.merged)) {
  //       console.log(`Found results! Finding null MOSS results...`)
  //       const results = JSON.parse(fsSync.readFileSync(`${conf.basePath.merged}`, 'utf-8'))
  //       const resultsWithNullURLs = results.filter(result => {})
        
  //       console.log(`Merging and writing to a new file...`)

  //       if(!fsSync.existsSync(`results/${conf.batch_name}/merged`))
  //         fsSync.mkdirSync(`results/${conf.batch_name}/merged`)

  //       fsSync.writeFileSync(`results/${conf.batch_name}/merged/${conf.repo.name}.json`, JSON.stringify(mergedResults, null, 2))
  //       console.log(`Mergine complete! Head onto results/merged/${conf.repo.name}.json to view the results!`)
  //     } else {
  //       console.log(`There are no MOSS results. Skipping...`)
  //     }

  //     return
  //   })
  //   .then(() => {
  //     console.timeEnd('Completed! Time needed for completion was')
  //   })
  // }
}

module.exports = MossController