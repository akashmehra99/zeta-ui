const getCountryDataFromApi = () => {
    const fetchPromise = fetch('https://restcountries.eu/rest/v2/all');
    fetchPromise.then((response) => {
        return (response.json());
    }).then((country) => {
        getCountryData(country);
    });
}

let dataFromAPI;
let filteredData = [];
let enteriesPerPage = 5;
let paginationIndex = 1;
let chunkedArray = [];

const getCountryData = (countryData) => {
    dataFromAPI = countryData;
    setNewNoOfEneteries();
    populateDataInTable(chunkedArray[0]);
}

document.addEventListener('DOMContentLoaded', (event) => {
    getCountryDataFromApi();
});

const populateDataInTable = (countryData) => {
    const table = document.getElementById('populateData');
    let tableData = '';
    countryData.forEach((data) => {
        const rowData = `<tr><td>${data.name}</td><td>${data.population}</td><td>${data.area}</td><td>${data.region}</td><td>${data.gini ? data.gini : 0}</td></tr>`;
        tableData = tableData + rowData;
    });
    table.innerHTML = tableData;
}

const setNewNoOfEneteries = () => {
    enteriesPerPage = document.getElementById('showEnteries').value;
    createCountryDataChunks(enteriesPerPage);
    setNoPagination();
    fetchRecordsBasedOnPagination(1);
}

const setNoPagination = () => {
    let noOfPages = filteredData.length > 0 ? (filteredData.length / enteriesPerPage) :(dataFromAPI.length / enteriesPerPage);
    if (!Number.isInteger(noOfPages)) {
        noOfPages = parseInt(noOfPages, 10) + 1;
    }
    const paginationUl = document.getElementById('paginationUl');
    let paginationButtons = '';
    for (let x = 1; x <= noOfPages; x++) {
        const pageItem = `<li class="page-item"><button class="page-link" onclick="fetchRecordsBasedOnPagination(${x})">${x}</button></li>`;
        paginationButtons = paginationButtons + pageItem;
    }
    paginationUl.innerHTML = paginationButtons;
}

const fetchRecordsBasedOnPagination = (pageNo) => {
    paginationIndex = pageNo;
    populateDataInTable(chunkedArray[paginationIndex - 1]);
}

const createCountryDataChunks = (enteries) => {
    const dataToBeChunked = filteredData.length > 0 ? filteredData : dataFromAPI;
    chunkedArray = dataToBeChunked.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / enteries);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, []);
}

const sortTableData = () => {
    const sortEntity = document.getElementById('sortBasedOn').value;
    const sortOrder = document.getElementById('sortOrder').value;
    if (sortEntity && sortOrder) {
        sortFunction(sortEntity, sortOrder);
    }
}

const sortFunction = (entity, order) => {
    dataFromAPI.sort(compareValues(entity, order));
    filteredData.sort(compareValues(entity, order));
    setNewNoOfEneteries();
}

const compareValues = (key, order = 'asc') => {
    return innerSort = (a, b) => {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }
        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'des') ? (comparison * -1) : comparison
        );
    };
}

const filterby = (value, entity, minLength) => {
    const inputVal = document.getElementById(value).value;
    if (inputVal.length > minLength) {
        filteredData = dataFromAPI.filter((data) => data[entity].toUpperCase().includes(inputVal.toUpperCase()));
        setNewNoOfEneteries();
    } else {
        filteredData = [];
        setNewNoOfEneteries();
    }
}