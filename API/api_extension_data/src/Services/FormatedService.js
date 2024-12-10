// Security.js (Tools)
const DepartementService = require('./DepartementService');
'use strict';

class ExtensionData {
    ValidFields(data) {
        const validFields = [
            'process',
            'input',
            'userDetails',
        ];
    
        // Filtrer les champs valides
        const formattedData = {};
        for (let field of validFields) {
            if (data.hasOwnProperty(field)) {
                formattedData[field] = data[field];
            }
        }
        return formattedData;
    }
    

    FormatedData(input, userDetails, process){
        if (process.id === 1) {
            const mappedInputs = [];
            function formatDate(dateString) {
                const date = new Date(dateString);
                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
                const year = date.getUTCFullYear();
                return `${day}/${month}/${year}`;
            }

            // For each target : get value from userdetail and return value or boolean
            const getUserData = (target, userDetails) => {
                switch (target) {
                    case 'BCCommencer':
                        return true;
                    case 'idResidentEnFrance':
                        return userDetails.country.toLowerCase() === "france";
                    case 'codePostal':
                        return userDetails.post_code;
                    case 'dateDeNaissance':
                        return formatDate(userDetails.birthday);
                    case 'idRevenus':
                        const { salary_1, salary_2, salary_3 } = userDetails.userFiscalDetails;
                        return [salary_1, salary_2, salary_3].some(salary => salary != null && salary != 0);
                    case 'BCSuivant':
                        return true;
                    case 'idCouple':
                        return userDetails.userFiscalDetails.in_couple !== 0;
                    case 'idFutureParent':
                        return userDetails.userFiscalDetails.waiting_child !== 0;
                    case 'idNbEnfant':
                        return userDetails.userFiscalDetails.child_number
                    case 'nbEnfants':
                        return Math.min(userDetails.userFiscalDetails.child_number, 20);
                    case 'idProprietaire':
                        return  userDetails.userFiscalDetails.owner !== 0 || userDetails.userFiscalDetails.housed_free_of_charge !== 0;
                    case 'allocationLogementMoisMoins3':
                        return userDetails.userFiscalDetails.housing_allowance_3;
                    case 'allocationLogementMoisMoins2':
                        return userDetails.userFiscalDetails.housing_allowance_2;
                    case 'allocationLogementMoisMoins1':
                        return userDetails.userFiscalDetails.housing_allowance_1;
                    case 'idAllocationAah':
                        const { aah_1, aah_2, aah_3 } = userDetails.userFiscalDetails;
                        return [aah_1, aah_2, aah_3].some(salary => salary != null && salary != 0);     
                    case 'situationTravailleur':
                        const { self_employed, auto_entrepreneur, student, employee, other } = userDetails.socialCategorie;

                        const socialCategories = {
                            self_employed: 'idSituProf1',
                            auto_entrepreneur: 'idSituProf2',
                            student: 'idSituProf3',
                            employee: 'idSituProf4',
                            other: 'idSituProf5'
                        };

                        const filteredCategories = { self_employed, auto_entrepreneur, student, employee, other };
                        
                        for (let key in filteredCategories) {
                            if (filteredCategories[key] !== 0) {
                                return socialCategories[key];
                            }
                        }
                        return socialCategories.other;
                    case 'idSecteurAct':
                        const employedActivity = {
                            'Profession liberale': 'idSecteurAct1',
                            'Artisan': 'idSecteurAct2',
                            'Commercant': 'idSecteurAct3',
                            'Autre': 'idSecteurAct4',
                        };

                        const filteredEmployedActivity = userDetails.socialCategorie.activity;

                        const getEmployedActivityKey = (activityValue) => {
                            return Object.entries(employedActivity).find(([key, value]) => value === activityValue)?.[0] || null;
                        };

                        return getEmployedActivityKey(filteredEmployedActivity);
                    case 'idBenefices':
                        const { self_employed_business_profits } = userDetails.userFiscalDetails;
                        return Boolean(self_employed_business_profits);
                    case 'montantBenefices':
                            return userDetails.userFiscalDetails.self_employed_business_profits
                    case 'chiffreAffaireMoisMoins3':
                        return userDetails.userFiscalDetails.sales_3;
                    case 'chiffreAffaireMoisMoins2':
                        return userDetails.userFiscalDetails.sales_2;
                    case 'chiffreAffaireMoisMoins1':
                        return userDetails.userFiscalDetails.sales_1;
                    case 'revenusMoisMoins3':
                        return userDetails.userFiscalDetails.salary_3;
                    case 'revenusMoisMoins2':
                        return userDetails.userFiscalDetails.salary_2;
                    case 'revenusMoisMoins1':
                        return userDetails.userFiscalDetails.salary_1;
                    case 'aahMontantMoisMoins3':
                        return userDetails.userFiscalDetails.aah_3;
                    case 'aahMontantMoisMoins2':
                        return userDetails.userFiscalDetails.aah_2;
                    case 'aahMontantMoisMoins1':
                        return userDetails.userFiscalDetails.aah_1;
                    case 'revenuPlacement':
                        return userDetails.userFiscalDetails.annual_investment_income;
                    case 'autresRessourcesMoisMoins3':
                        return userDetails.userFiscalDetails.other_resources_received_3;
                    case 'autresRessourcesMoisMoins2':
                        return userDetails.userFiscalDetails.other_resources_received_2;
                    case 'autresRessourcesMoisMoins1':
                        return userDetails.userFiscalDetails.other_resources_received_1;
                    default:
                        return null;
                }
            };

            const putDataValue = (userData) => {
                if (typeof userData === 'string' && (userData.includes('idSituProf') || userData.includes('idSecteurAct'))) {
                    return "click";
                }
                return typeof userData === 'boolean' ? "click" : userData;
            }
            
            const addMappedInput = (page, input, value) => {
                mappedInputs.push({
                    page: page,
                    input: {
                        ...input,
                        value: value
                    }
                });
            };

            var sortedInputs = input.sort((a, b) => a.rank - b.rank);

            for (let i = 0; i < sortedInputs.length; i++) {
                const item = sortedInputs[i];
                const target = item.input.css_target_id;
                const page = item.page;
                const userData = getUserData(target, userDetails);

                // Sometimes we need to modify the css_target_id. For the specified target we change the css_target_id.
                // Moreover: Depending on the value put in input, some other input can be delete. So if one target can delete another input we also do this here. 
                if (target === 'idResidentEnFrance' && !userData) {
                    item.input.css_target_id += 'N';
                    const value = putDataValue(userData)
                    addMappedInput(page, item.input, value)

                    const suivantInput = sortedInputs.find(inputItem => inputItem.input.css_target_id === 'BCSuivant');
                    if (suivantInput) {
                        addMappedInput(suivantInput.page, suivantInput.input, "click");
                    }

                    break;
                } else if (target === 'idRevenus' && !userData) {
                    const value = putDataValue(userData)
                    addMappedInput(page, item.input, value)
                    const suivantInput = sortedInputs.find(inputItem => inputItem.input.css_target_id === 'BCSuivant');
                    if (suivantInput) {
                        addMappedInput(suivantInput.page, suivantInput.input, "click");
                    }
                    break;
                } else if (target === 'idAllocationAah' && !userData) {
                    item.input.css_target_id += 'N';
                    sortedInputs = sortedInputs.filter(inputItem => 
                        !['aahMontantMoisMoins1', 'aahMontantMoisMoins2', 'aahMontantMoisMoins3'].includes(inputItem.input.css_target_id)
                    );
                } else if (target === 'situationTravailleur') {
                    item.input.css_target_id = userData;
                    if (userData === 'idSituProf3' || userData === 'idSituProf4' || userData === 'idSituProf5') {
                        sortedInputs = sortedInputs.filter(inputItem => 
                            !['idSecteurAct', 'idBenefices', 'montantBenefices', 'chiffreAffaireMoisMoins3', 'chiffreAffaireMoisMoins2', 'chiffreAffaireMoisMoins1'].includes(inputItem.input.css_target_id)
                        );
                    }

                    if (userData === 'idSituProf2') {
                        sortedInputs = sortedInputs.filter(inputItem => 
                            !['idBenefices', 'montantBenefices'].includes(inputItem.input.css_target_id)
                        );
                    }
                } else if (target === 'idSecteurAct') {
                    item.input.css_target_id = userData;
                } else if (target === 'idCouple') {
                    item.input.css_target_id += userData ? 'Couple' : 'Seul';
                } else if (target === 'idNbEnfant') {
                    const value = Math.min(userData, 5); 
                    item.input.css_target_id += value;

                    if (value < 5 && i + 1 < sortedInputs.length) {
                        sortedInputs.splice(i + 1, 1);
                    }
                } else if (target === 'idBenefices') {
                    const excludedTargets = userData 
                        ? new Set(['chiffreAffaireMoisMoins3', 'chiffreAffaireMoisMoins2', 'chiffreAffaireMoisMoins1']) 
                        : new Set(['montantBenefices']);

                    item.input.css_target_id += userData ? 'O' : 'N';

                    sortedInputs = sortedInputs.filter(({ input: { css_target_id } }) => 
                        !excludedTargets.has(css_target_id)
                    );
                } else {
                    if (typeof userData === 'boolean' && target != 'BCCommencer' && target != 'BCSuivant') {
                        item.input.css_target_id += userData ? 'O' : 'N';
                    }
                }
    
                if (target === 'idNbEnfant'){
                    const value = 'click'
                    addMappedInput(page, item.input, value)
                } else {
                    const value = putDataValue(userData)
                    addMappedInput(page, item.input, value)
                }

            }

            return mappedInputs
        }

        if (process.id === 5) {
            const mappedInputs = [];
            function formatDate(dateString) {
                const date = new Date(dateString);
                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
                const year = date.getUTCFullYear();
                return `${day}/${month}/${year}`;
            }

            const putDataValue = (userData) => {
                if (typeof userData === 'string' && (userData.includes('idSituProf') || userData.includes('idSecteurAct'))) {
                    return "click";
                }
                return typeof userData === 'boolean' ? "click" : userData;
            }
            
            const addMappedInput = (page, input, value) => {
                mappedInputs.push({
                    page: page,
                    input: {
                        ...input,
                        value: value
                    }
                });
            };

            var sortedInputs = input.sort((a, b) => a.rank - b.rank);
            sortedInputs = sortedInputs.filter(inputItem => 
                inputItem.input.css_target_id !== 'userWorked24Months'
            );
            for (let i = 0; i < sortedInputs.length; i++) {
                const item = sortedInputs[i];
                const target = item.input.css_target_id;
                const page = item.page;
                switch (target) {
                    case 'submit':
                        addMappedInput(page, item.input, 'click')
                        break;
                    case 'userPlaceOfResidence':
                        if (userDetails.country.toLowerCase() === 'france') {
                            const departement = DepartementService.getDepartementFromPostalCode(userDetails.post_code)
                            if (departement === 'mayotte') {
                                item.input.css_target_id += '1';
                                sortedInputs = sortedInputs.filter(inputItem => 
                                    inputItem.input.css_target_id !== 'userRso'
                                );
                            } else if (
                                departement === 'guadeloupe' ||
                                departement === 'martinique' ||
                                departement === 'guyane' ||
                                departement === 'la réunion'
                            ) {
                                item.input.css_target_id += '2';
                            } else {
                                item.input.css_target_id += '0';
                                sortedInputs = sortedInputs.filter(inputItem => 
                                    inputItem.input.css_target_id !== 'userRso'
                                );
                            }
                        } else {
                            item.input.css_target_id += '3';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userRso', 'codePostal'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userRso':
                        if(userDetails.userFiscalDetails.rso !== 0) {
                            item.input.css_target_id += 'Yes';
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'codePostal':
                        addMappedInput(page, item.input, userDetails.post_code);
                        break;
                    case 'userCompoFamily':
                        let baseId;

                        if (userDetails.userFiscalDetails.in_couple !== 0) {
                            baseId = 4;
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userEti'
                            );
                        } else {
                            baseId = 0;
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userAndSpouseEti'
                            );
                        }

                        if (userDetails.userFiscalDetails.child_number >= 3) {
                            item.input.css_target_id += (baseId + 3).toString();
                        } else {
                            item.input.css_target_id += (baseId + userDetails.userFiscalDetails.child_number).toString();
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userEti':
                        if(userDetails.socialCategorie.self_employed !== 0) {
                            item.input.css_target_id += 'Yes';
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userAndSpouseEti':
                        if(userDetails.socialCategorie.self_employed !== 0) {
                            item.input.css_target_id += 'Yes';
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'BCContinuer':
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userAge':
                        const birthDate = new Date(userDetails.birthday);
                        const today = new Date();

                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        const dayDiff = today.getDate() - birthDate.getDate();

                        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                            age--;
                        }
                    
                        if (age < 18) {
                            item.input.css_target_id += '0';

                        } else if (age >= 18 && age <= 24) {
                            item.input.css_target_id += '1';
                        } else {
                            item.input.css_target_id += '2';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userNationality':
                        if(userDetails.nationality == 'française') {
                            item.input.css_target_id += '0';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userLivedMoreThan5YearsWithResCard'
                            );
                        } else if(userDetails.nationality == 'UE') {
                            item.input.css_target_id += '1';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userLivedMoreThan5YearsWithResCard'
                            );
                        } else {
                            item.input.css_target_id += '2';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userLivedMoreThan5YearsWithResCard':
                        if(userDetails.livedMoreThan5YearsWithResCard !== 0) {
                            item.input.css_target_id += 'Yes';
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userSeparated':

                        if(userDetails.separated !== 0) {
                            item.input.css_target_id += 'Yes';
                        } else {
                            item.input.css_target_id += 'No';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateBeginingIsolation'
                            );
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateBeginingIsolation':
                        addMappedInput(page, item.input, formatDate(userDetails.separated_date));
                        break;
                    case 'userHavingBaby':
                        if(userDetails.userFiscalDetails.waiting_child !== 0) {
                            item.input.css_target_id += 'Yes';
                        } else {
                            item.input.css_target_id += 'No';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDatePregnancy'
                            );
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDatePregnancy':
                        addMappedInput(page, item.input, formatDate(userDetails.waiting_child_date));
                        break;
                    case 'userJob':
                        const { self_employed, auto_entrepreneur, without_activity, student, apprenticeship, employee, other } = userDetails.socialCategorie;

                        const socialCategories = {
                            employee: '0',
                            self_employed: '1',
                            auto_entrepreneur: '2',
                            without_activity: '3',
                            student: '4',
                            apprenticeship: '5',
                            other: '6'
                        };

                        const filteredCategories = { self_employed, auto_entrepreneur, without_activity, student, apprenticeship, employee, other };
                        for (let key in filteredCategories) {
                            if (filteredCategories[key] !== 0) {
                                if(key === "self_employed" || key === "auto_entrepreneur") {
                                    item.input.css_target_id += socialCategories[key];
                                    sortedInputs = sortedInputs.filter(inputItem => 
                                        inputItem.input.css_target_id !== 'userJobWithoutWorkAfterResignation'
                                    )
                                } else if (key === "without_activity") {
                                    item.input.css_target_id += socialCategories[key];
                                    sortedInputs = sortedInputs.filter(inputItem => 
                                        inputItem.input.css_target_id !== 'userTypeSelfEmployment'
                                    )
                                } else {
                                    item.input.css_target_id += socialCategories[key];
                                    sortedInputs = sortedInputs.filter(inputItem => 
                                        !['userTypeSelfEmployment', 'userJobWithoutWorkAfterResignation'].includes(inputItem.input.css_target_id)
                                    );
                                }
                            }
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userTypeSelfEmployment':
                        const employedActivity = {
                            'Artisan': '0',
                            'Commercant': '1',
                            'Profession liberale': '2'
                        };

                        const filteredEmployedActivity = userDetails.socialCategorie.activity;

                        const getEmployedActivityKey = (activityValue) => {
                            return Object.entries(employedActivity).find(([key, value]) => value === activityValue)?.[0] || null;
                        };

                        item.input.css_target_id += getEmployedActivityKey(filteredEmployedActivity);
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userJobWithoutWorkAfterResignation':
                        if(userDetails.userFiscalDetails.leave_job !== 0) {
                            item.input.css_target_id += 'Yes';
                        } else {
                            item.input.css_target_id += 'No';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateResignation'
                            );
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateResignation':
                        addMappedInput(page, item.input, formatDate(userDetails.userFiscalDetails.leave_job_date));
                        break;
                    // case 'userWorked24Months':
                    //     if(userDetails.userFiscalDetails.Worked24Months !== 0) {
                    //         item.input.css_target_id += 'Yes';
                    //     } else {
                    //         item.input.css_target_id += 'No';
                    //     }
                    //     addMappedInput(page, item.input, 'click');
                    case 'userIsOwner':
                        if(userDetails.userFiscalDetails.owner !== 0 || userDetails.userFiscalDetails.housed_free_of_charge !== 0) {
                            item.input.css_target_id += 'Yes'
                        } else {
                            item.input.css_target_id += 'No'
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userActivityIncomesMonth1':
                        if (userDetails.userFiscalDetails.salary_1 === 0 && userDetails.userFiscalDetails.salary_2 === 0 && userDetails.userFiscalDetails.salary_3 === 0) {
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userLostActivity', 'userDateLostActivity'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.salary_1);
                        break;
                    case 'userActivityIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.salary_2);
                        break;
                    case 'userActivityIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.salary_3);
                        break;
                    case 'userLostActivity':
                        if(userDetails.userFiscalDetails.lost_activity !== 0) {
                            item.input.css_target_id += 'Yes';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateLostActivity'
                            );
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateLostActivity':
                        addMappedInput(page, item.input, formatDate(userDetails.userFiscalDetails.lost_activity_date));
                        break;
                    case 'userUnempBenefitsIncomesMonth1':
                        if (userDetails.userFiscalDetails.other_resources_received_1 === 0 && userDetails.userFiscalDetails.other_resources_received_2 === 0 && userDetails.userFiscalDetails.other_resources_received_3 === 0) {
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userLostUnempBenefits', 'userDateLostUnempBenefits'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_resources_received_1);
                        break;
                    case 'userUnempBenefitsIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_resources_received_2);
                        break;
                    case 'userUnempBenefitsIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_resources_received_3);
                        break;
                    case 'userLostUnempBenefits':
                        if(userDetails.userFiscalDetails.lost_other_resources_received !== 0) {
                            item.input.css_target_id += 'Yes';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateLostUnempBenefits'
                            );
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateLostUnempBenefits':
                        addMappedInput(page, item.input, formatDate(userDetails.userFiscalDetails.lost_other_resources_received_date));
                        break;
                    case 'userAdoptionMaternityBenefitIncomesMonth1':
                        if (userDetails.userFiscalDetails.social_security_income_1 === 0 && userDetails.userFiscalDetails.social_security_income_2 === 0 && userDetails.userFiscalDetails.social_security_income_3 === 0) {
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userLostAdoptionMaternityBenefit', 'userDateLostAdoptionMaternityBenefit'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.social_security_income_1);
                        break;
                    case 'userAdoptionMaternityBenefitIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.social_security_income_2);
                        break;
                    case 'userAdoptionMaternityBenefitIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.social_security_income_3);
                        break;
                    case 'userLostAdoptionMaternityBenefit':
                        if(userDetails.userFiscalDetails.lost_social_security_income !== 0) {
                            item.input.css_target_id += 'Yes';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateLostAdoptionMaternityBenefit'
                            );
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateLostAdoptionMaternityBenefit':
                        addMappedInput(page, item.input, formatDate(userDetails.userFiscalDetails.lost_social_security_income_date));
                        break;
                    case 'userFoodPensionIncomesMonth1':
                        if (userDetails.userFiscalDetails.food_pension_income_1 === 0 && userDetails.userFiscalDetails.food_pension_income_2 === 0 && userDetails.userFiscalDetails.food_pension_income_3 === 0) {
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userLostFoodPension', 'userDateLostFoodPension'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.food_pension_income_1);
                        break;
                    case 'userFoodPensionIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.food_pension_income_2);
                        break;
                    case 'userFoodPensionIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.food_pension_income_3);
                        break;
                    case 'userLostFoodPension':
                        if(userDetails.userFiscalDetails.lost_food_pension_income !== 0) {
                            item.input.css_target_id += 'Yes';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateLostFoodPension'
                            );
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateLostFoodPension':
                        addMappedInput(page, item.input, formatDate(userDetails.userFiscalDetails.lost_food_pension_income_date));
                        break;
                    case 'userOtherPensionsIncomesMonth1':
                        if (userDetails.userFiscalDetails.other_pension_received_1 === 0 && userDetails.userFiscalDetails.other_pension_received_2 === 0 && userDetails.userFiscalDetails.other_pension_received_3 === 0) {
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userLostOtherPensions', 'userDateLostOtherPensions'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_pension_received_1);
                        break;
                    case 'userOtherPensionsIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_pension_received_2);
                        break;
                    case 'userOtherPensionsIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_pensions_received_3);
                        break;
                    case 'userLostOtherPensions':
                        if(userDetails.userFiscalDetails.lost_other_pensions !== 0) {
                            item.input.css_target_id += 'Yes';
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateLostOtherPensions'
                            );
                        } else {
                            item.input.css_target_id += 'No';
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateLostOtherPensions':
                        addMappedInput(page, item.input, formatDate(userDetails.userFiscalDetails.lost_other_pensions_date));
                        break;
                    case 'userHousingAssistanceIncomesMonth1':
                        if (userDetails.userFiscalDetails.housing_allowance_1 === 0 && userDetails.userFiscalDetails.housing_allowance_2 === 0 && userDetails.userFiscalDetails.housing_allowance_3 === 0) {
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userLostOtherPensions', 'userDateLostOtherPensions'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.housing_allowance_1);
                        break;
                    case 'userHousingAssistanceIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.housing_allowance_2);
                        break;
                    case 'userHousingAssistanceIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.housing_allowance_3);
                        break;
                    case 'userAahIncomesMonth1':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.aah_1);
                        break;
                    case 'userAahIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.aah_2);
                        break;
                    case 'userAahIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.aah_3);
                        break;
                    case 'userFamilyBenefitsIncomesMonth1':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_resources_received_1);
                        break;
                    case 'userFamilyBenefitsIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_resources_received_2);
                        break;
                    case 'userFamilyBenefitsIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.other_resources_received_3);
                        break;
                    case 'userRentIncomesMonth1':
                        if (userDetails.userFiscalDetails.rent_received_1 === 0 && userDetails.userFiscalDetails.rent_received_2 === 0 && userDetails.userFiscalDetails.rent_received_3 === 0) {
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userLostRent', 'userDateLostRent'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.rent_received_1);
                        break;
                    case 'userRentIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.rent_received_2);
                        break;
                    case 'userRentIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.rent_received_3);
                        break;
                    case 'userLostRent':
                        if(userDetails.userFiscalDetails.lost_rent !== 0) {
                            item.input.css_target_id += 'Yes'
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateLostRent'
                            );
                        } else {
                            item.input.css_target_id += 'No'
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateLostRent':
                        addMappedInput(page, item.input, formatDate(userDetails.userFiscalDetails.lost_rent_date));
                        break;
                    case 'userHeritageIncomes':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.heritage_incomes);
                        break;
                    case 'userFinancialAssistanceIncomesMonth1':
                        if (userDetails.userFiscalDetails.financial_assistance_incomes_1 === 0 && userDetails.userFiscalDetails.financial_assistance_incomes_2 === 0 && userDetails.userFiscalDetails.financial_assistance_incomes_3 === 0) {
                            sortedInputs = sortedInputs.filter(inputItem => 
                                !['userLostFinancialAssistance', 'userDateLostFinancialAssistance'].includes(inputItem.input.css_target_id)
                            );
                        }
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.financial_assistance_incomes_1);
                        break;
                    case 'userFinancialAssistanceIncomesMonth2':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.financial_assistance_incomes_2);
                        break;
                    case 'userFinancialAssistanceIncomesMonth3':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.financial_assistance_incomes_3);
                        break;
                    case 'userLostFinancialAssistance':
                        if(userDetails.userFiscalDetails.lost_financial_assistance_incomes !== 0) {
                            item.input.css_target_id += 'Yes'
                            sortedInputs = sortedInputs.filter(inputItem => 
                                inputItem.input.css_target_id !== 'userDateLostFinancialAssistance'
                            );
                        } else {
                            item.input.css_target_id += 'No'
                        }
                        addMappedInput(page, item.input, 'click');
                        break;
                    case 'userDateLostFinancialAssistance':
                        addMappedInput(page, item.input, formatDate(userDetails.userFiscalDetails.lost_financial_assistance_incomes_date));
                        break;
                    case 'userInvestedMoneyIncomes':
                        addMappedInput(page, item.input, userDetails.userFiscalDetails.invested_money_incomes);
                        break;
                    case 'BCValider':
                        addMappedInput(page, item.input, 'click');
                        break;
                    default:
                        break;
                }
            }
            return mappedInputs
        }


    }
}


module.exports = new ExtensionData();