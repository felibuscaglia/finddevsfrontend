const initialState = {
    allSkills: [],
    userInfo: {},
    projects: [],
    users: [],
    jobs: [],
    skillSelection: [],
    jobSkillSelection: [],
    filteredWorkers: [],
    filteredJobs: [],
    notifications: [],
    limitOfPosts: false
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_GLOBAL_SKILLS':
            return {
                ...state,
                allSkills: action.payload
            }
        case 'SET_USER_DATA':
            const find = action.payload.projects.find (project => project.userXprojects.isFounder === true && !project.isDeleted && project.ownerId ===action.payload.id);
            return {
                ...state,
                userInfo: action.payload,
                limitOfPosts: find && !action.payload.isPremium ? true : false
            }
        case 'SET_PROJECTS':
            return {
                ...state,
                projects: action.payload,
            }
        case 'GET_USERS':
            return {
                ...state,
                users: action.payload,
                filteredWorkers: action.payload
            }
        case 'GET_JOBS':
            return {
                ...state,
                jobs: action.payload,
                filteredJobs: action.payload
            }
        case 'REMOVE_FILTER':
            const preFilteredSkills = state.skillSelection.filter(skill => skill.id !== action.payload.id);
            if (preFilteredSkills.length > 0) {
                var firstFilteredWorkers = [];
                for (var i = 0; i < state.users.length; i++) {
                    for (var j = 0; j < state.users[i].skills.length; j++) {
                        if (state.users[i].skills[j].id === preFilteredSkills[0].id) firstFilteredWorkers.push(state.users[i]);
                    }
                }
                for (var i = 1; i < preFilteredSkills.length; i++) {
                    firstFilteredWorkers = firstFilteredWorkers.filter(worker => {
                        for (var j = 0; j < worker.skills.length; j++) {
                            if (worker.skills[j].id === preFilteredSkills[i].id) return worker;
                        }
                    })
                }
            }
            return {
                ...state,
                skillSelection: preFilteredSkills,
                filteredWorkers: preFilteredSkills.length > 0 ? firstFilteredWorkers : state.users
            }

        case 'REMOVE_JOB_FILTER':
            const preFilteredJobSkills = state.jobSkillSelection.filter(skill => skill.id !== action.payload.id);
            if (preFilteredJobSkills.length > 0) {
                var firstFilteredJobs = [];
                for (var i = 0; i < state.jobs.length; i++) {
                    for (var j = 0; j < state.jobs[i].skills.length; j++) {
                        if (state.jobs[i].skills[j].id === preFilteredJobSkills[0].id) firstFilteredJobs.push(state.jobs[i]);
                    }
                }
                for (var i = 1; i < preFilteredJobSkills.length; i++) {
                    firstFilteredJobs = firstFilteredJobs.filter(job => {
                        for (var j = 0; j < job.skills.length; j++) {
                            if (job.skills[j].id === preFilteredJobSkills[i].id) return job;
                        }
                    })
                }
            }
            return {
                ...state,
                jobSkillSelection: preFilteredJobSkills,
                filteredJobs: preFilteredJobSkills.length > 0 ? firstFilteredJobs : state.jobs
            }

        case 'SELECT_WORKERS':
            var filteredArray = state.filteredWorkers.map(worker => {
                for (var i = 0; i < worker.skills.length; i++) {
                    if (worker.skills[i].label === action.payload.label) return worker;
                }
            });
            filteredArray = filteredArray.filter(worker => worker !== undefined);
            filteredArray = filteredArray.sort((a, b) => {
                return b.isPremium - a.isPremium
            })
            const found = state.allSkills.find(skill => skill.id === action.payload.id);
            return {
                ...state,
                filteredWorkers: filteredArray,
                skillSelection: state.skillSelection.concat(found)
            }

        case 'FILTER_JOBS':
            var filteredArray = state.filteredJobs.map(job => {
                for (var i = 0; i < job.skills.length; i++) {
                    if (job.skills[i].label === action.payload.label) return job;
                }
            });
            filteredArray = filteredArray.filter(job => job !== undefined);
            const skillFound = state.allSkills.find(skill => skill.id === action.payload.id);
            return {
                ...state,
                filteredJobs: filteredArray,
                jobSkillSelection: state.jobSkillSelection.concat(skillFound)
            }

        case 'GET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload
            }

        default: return state
    }
}


export default rootReducer;