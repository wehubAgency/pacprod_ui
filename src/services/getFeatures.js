export default (features = [], common, appType, role) => {
  let allFeatures = [...features];
  const games = ['qrflash', 'argame', 'quiz', 'vote', 'circusQuiz'];
  const conditionnalGames = ['quiz', 'vote'];
  if (features.some(f => games.indexOf(f) > -1)) {
    allFeatures.push('prizeInfos');
  }
  if (features.some(f => conditionnalGames.indexOf(f) > -1)) {
    allFeatures.push('gameConditions');
  }
  if (features.includes('qrflash') || features.includes('argame')) {
    allFeatures.push('company');
    allFeatures.push('currency');
  }
  if (features.some(f => f.match(RegExp('^ar')))) {
    if (features.includes('argame') && features.includes('arexpo')) {
      allFeatures = allFeatures.filter(f => !f.match(RegExp('^ar')));
      allFeatures.push('ar');
    }
  }
  allFeatures = [...allFeatures, ...common];
  allFeatures.push(appType);
  if (role === 'super_admin') {
    allFeatures.push('admin');
  }

  return allFeatures;
};
