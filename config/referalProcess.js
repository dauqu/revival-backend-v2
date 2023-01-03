
const User = require('../models/userSchema');

function getAmount(level) {
    switch (Number(level)) {
        case 1:
            amount = 150;
            break;
        case 2:
            amount = 225;
            break;
        case 3:
            amount = 337.5;
            break;
        case 4:
            amount = 506.25;
            break;
        case 5:
            amount = 759.375;
            break;
        default:
            amount = 150;
            break;
    }
    return amount;
}

function calculateAmout(percentage, amount) {
    return (percentage / 100) * amount;
}

async function updateUpperLevel(referal, amount, level, maxlevel, direct = false, distributed=0) {
    try {
        console.log('Working...' + referal + " " + level + " " + maxlevel + " " + amount);
        if (level === maxlevel) {
            return amount+distributed;
        }

        const user = await User.findByIdAndUpdate(referal);

        if (direct) {
            user.total_referral += 1;
        }

        let calcAmount = calculateAmout(10, amount);
        
        
        user.total_earning += Number(calcAmount);
        user.total_referral_earning += Number(calcAmount);
        amount = Number(calcAmount);
        await user.save();

        direct = false;
        if(user.referred_by === undefined || user.referred_by === null || user.referred_by === ""){
            return amount+distributed;
        }
        return await updateUpperLevel(user.referred_by, amount, ++level, maxlevel, direct, distributed+amount);
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getAmount,
    calculateAmout,
    updateUpperLevel
}