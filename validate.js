const fs = require('fs');
const path = require('path');

// HTML validation
function validateHTML(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for basic structure
  if (!content.includes('<!DOCTYPE html>')) {
    issues.push('Missing DOCTYPE declaration');
  }
  
  if (!content.includes('<meta charset="UTF-8"')) {
    issues.push('Missing charset meta tag');
  }
  
  if (!content.includes('<meta name="viewport"')) {
    issues.push('Missing viewport meta tag for responsiveness');
  }
  
  // Check for accessibility
  if (!content.includes('alt=') && !content.includes('aria-label=') && !content.includes('role="img"')) {
    issues.push('Images/emojis should have alt attributes or ARIA labels for accessibility');
  }
  
  // Check for security
  if (content.includes('javascript:')) {
    issues.push('Avoid javascript: URLs for security');
  }
  
  return issues;
}

// JavaScript validation
function validateJavaScript(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for potential issues
  if (content.includes('eval(')) {
    issues.push('Avoid eval() for security');
  }
  
  if (content.includes('innerHTML') && !content.includes('textContent')) {
    issues.push('Consider using textContent instead of innerHTML when possible');
  }
  
  if (!content.includes('try') || !content.includes('catch')) {
    issues.push('Consider adding error handling with try-catch blocks');
  }
  
  return issues;
}

// Performance checks
function validatePerformance(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const recommendations = [];
  
  // Check for inefficient selectors
  if ((content.includes('document.querySelector') || content.includes('document.querySelectorAll') || content.includes('getElementById')) && 
      !content.includes('cacheElements') && !content.includes('elements =')) {
    recommendations.push('Consider caching DOM selectors for better performance');
  }
  
  // Check for event listeners
  if (content.includes('addEventListener')) {
    recommendations.push('Ensure event listeners are properly removed when not needed');
  }
  
  return { issues, recommendations };
}

// Security checks
function validateSecurity(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for XSS vulnerabilities
  if (content.includes('innerHTML') && content.includes('userInput')) {
    issues.push('Potential XSS vulnerability: user input used with innerHTML');
  }
  
  // Check for localStorage usage
  if (content.includes('localStorage')) {
    issues.push('localStorage usage detected - ensure sensitive data is not stored');
  }
  
  return issues;
}

// Main validation
function main() {
  const htmlFile = path.join(__dirname, 'index.html');
  console.log('🔍 Validating Call Tracker...\n');
  
  // Validate HTML
  console.log('📄 HTML Validation:');
  const htmlIssues = validateHTML(htmlFile);
  if (htmlIssues.length === 0) {
    console.log('✅ HTML validation passed');
  } else {
    htmlIssues.forEach(issue => console.log(`⚠️  ${issue}`));
  }
  
  // Validate JavaScript
  console.log('\n📜 JavaScript Validation:');
  const jsIssues = validateJavaScript(htmlFile);
  if (jsIssues.length === 0) {
    console.log('✅ JavaScript validation passed');
  } else {
    jsIssues.forEach(issue => console.log(`⚠️  ${issue}`));
  }
  
  // Validate Performance
  console.log('\n⚡ Performance Analysis:');
  const perfAnalysis = validatePerformance(htmlFile);
  if (perfAnalysis.issues.length === 0) {
    console.log('✅ No performance issues found');
  } else {
    perfAnalysis.issues.forEach(issue => console.log(`⚠️  ${issue}`));
  }
  
  if (perfAnalysis.recommendations.length > 0) {
    console.log('\n💡 Performance Recommendations:');
    perfAnalysis.recommendations.forEach(rec => console.log(`💡 ${rec}`));
  }
  
  // Validate Security
  console.log('\n🔒 Security Analysis:');
  const securityIssues = validateSecurity(htmlFile);
  if (securityIssues.length === 0) {
    console.log('✅ Security validation passed');
  } else {
    securityIssues.forEach(issue => console.log(`🔒 ${issue}`));
  }
  
  // Overall assessment
  const totalIssues = htmlIssues.length + jsIssues.length + perfAnalysis.issues.length + securityIssues.length;
  console.log(`\n📊 Summary:`);
  console.log(`Total issues found: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('🎉 All validations passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some issues need attention');
    process.exit(1);
  }
}

main();