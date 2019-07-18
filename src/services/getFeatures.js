export default (features, common, appType, role) => {
  let allFeatures = [...features];
  const games = ['qrflash', 'argame', 'quiz', 'vote', 'circusQuiz'];
  const conditionnalGames = ['quiz', 'vote'];
  if (features.some((f) => games.indexOf(f) > -1)) {
    allFeatures.push('prizeInfos');
  }
  if (features.some((f) => conditionnalGames.indexOf(f) > -1)) {
    allFeatures.push('gameConditions');
  }
  if (features.includes('qrflash') || features.includes('argame')) {
    allFeatures.push('company');
    allFeatures.push('currency');
  }
  allFeatures = [...allFeatures, ...common];
  allFeatures.push(appType);
  if (role === 'super_admin') {
    allFeatures.push('admin');
  }
  if (appType === 'flashapp') {
    const index = allFeatures.indexOf('user');
    allFeatures.splice(index, 1);
  }

  return allFeatures;
};
