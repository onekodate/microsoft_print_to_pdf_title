const elem = (id) => document.getElementById(id);

const decoder = new TextDecoder("shift-jis");

const update_checkbox = (string) => {
    const codes = string.split("").filter((val, idx)=> idx % 2 === 1).map((val, idx) => string[2*idx]+string[2*idx+1]);
    const tbody = document.createElement("tbody");
    const tr1 = document.createElement("tr");
    const tr2 = document.createElement("tr");
    tr1.id = "tr1";
    tr2.id = "tr2";
    codes.forEach((code, idx, arr) => {
        const char = String.fromCharCode(parseInt(code, 16));
        const checked = (/[\d|a-z|A-Z|\.|\(|\)]/).test(char);
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        td1.innerHTML = `<input type="radio" id="tr1_radio_${idx}" name="radio_${idx}" value="${char}" onChange="update_output();" ${checked?"checked":""}><label for="tr1_radio_${idx}">${char}</label>`;
        if (idx<codes.length-1 && !checked) {
            const char2 = decoder.decode(new Uint8Array([parseInt(code, 16), parseInt(arr[idx+1], 16)]));
            td2.innerHTML = `<input type="radio" id="tr2_radio_${idx}" name="radio_${idx}" value="${char2}" onChange="update_output();" ${checked?"":"checked"}><label for="tr2_radio_${idx}">${char2}</label>`;
        };
        tr1.append(td1);
        tr2.append(td2);
    });
    tbody.append(tr1);
    tbody.append(tr2);
    elem("table").replaceChildren(tbody);
    update_output();
};

const update_output = () => {
    let tr1 = Array.from(elem("tr1").getElementsByTagName("input"));
    let tr2 = tr1.map(val => elem(val.id.replace("tr1_","tr2_")));

    tr2.forEach((val, idx) => {
        if (val != null) {
            if (idx > 0 && tr2[idx-1] != null) val.disabled = tr2[idx-1].checked;
            if (val.disabled) val.checked = false;
        };
    });

    tr1.forEach((val, idx) => {
        if (idx > 0 && tr2[idx-1] != null) val.disabled = tr2[idx-1].checked;
        if (val.disabled) val.checked = true;
    });

    elem("output").innerText = tr1.map((val, idx) => {
        if (!val.disabled && val.checked) return val.value;
        if (tr2[idx]!= null && !tr2[idx].disabled && tr2[idx].checked) return tr2[idx].value;
        return "";

    }).join("");
};

update_checkbox(elem("input").value);