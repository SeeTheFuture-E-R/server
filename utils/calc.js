const { DATE } = require("sequelize");


class Calc {

    calcPoints = (user) => {
        console.log(user)

        var point = user.handicap_precentage ? user.handicap_precentage * 0.25 : 0
        // point+= user.num_of_children? user.num_of_children: 0
        console.log(point)

        const d = new Date()
     
        if (user.birth_year && d.year - 18 < user.birth_year.year)
            point += 2

        if (user.family_status == "Married")
            point += 1.5
        else if (user.family_status == "Divorcee" || user.family_status == "Separated" || user.family_status == "Widower")
            point += 3

        return point;
    }


    calcExpireDate = () => {
        const numWeeks = 2;
        const now = new Date();
        now.setDate(now.getDate() + numWeeks * 7);
        return now;
    }
}


const calc = new Calc();
module.exports = calc;