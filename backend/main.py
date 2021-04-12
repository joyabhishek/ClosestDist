from flask import Flask, g, request
import pandas as pd
import numpy as np
import scipy.stats
from scipy.stats import *
from sklearn.preprocessing import StandardScaler
import math
import statsmodels.api as sm
import os
import re

app = Flask(__name__)

df = None


@app.route('/hello', methods=['POST', 'GET'])
def hello_world():
    return {'Reasponse': 'Hello World'}


@app.route('/readCSV', methods=['POST'])
def read_csv():
    csvFilePath = request.json['csvFilePath']
    print(f"CSV file path {csvFilePath}")
    if not os.path.isfile(csvFilePath):
        return {'result': False, 'msg': f'File: {csvFilePath} Doesn\'t exist'}

    print("Reached Here")
    if not re.search(".*\.csv", csvFilePath):
        return {'result': False, 'msg': f'File: {csvFilePath} is not of csv format'}

    print("Reached Here1")
    try:
        global df
        df = pd.read_csv(csvFilePath, engine='python')
        columns = getColumns(df)
        return {'result': True, 'columns': columns, 'msg': 'Successfull'}
    except Exception as e:
        print(f'Failed to read file: {csvFilePath}')
        print(f'Exception: {e}')
        return {'result': False, 'msg': f'Failed to read file: {csvFilePath}'}


def getColumns(df):
    # Only show columns of dtype int and float
    columns = []
    for i, j in df.dtypes.iteritems():
        if j == np.int64 or j == np.float64:
            columns.append(i)
    return columns


def standarise(df, column, pct, pct_lower):
    sc = StandardScaler()
    y = df[column][df[column].notnull()].to_list()
    y.sort()
    len_y = len(y)
    y = y[int(pct_lower * len_y):int(len_y * pct)]
    len_y = len(y)
    yy = ([[x] for x in y])
    sc.fit(yy)
    y_std = sc.transform(yy)
    y_std = y_std.flatten()
    return y_std, len_y, y


def fit_distribution(df, column, dist_names, pct, pct_lower):
    # Set up list of candidate distributions to use
    # See https://docs.scipy.org/doc/scipy/reference/stats.html for more
    y_std, size, y_org = standarise(df, column, pct, pct_lower)

    chi_square_statistics = []
    # 11 bins
    percentile_bins = np.linspace(0, 100, 11)
    percentile_cutoffs = np.percentile(y_std, percentile_bins)
    observed_frequency, bins = (np.histogram(y_std, bins=percentile_cutoffs))
    cum_observed_frequency = np.cumsum(observed_frequency)

    # Loop through candidate distributions

    for distribution in dist_names:
        # Set up distribution and get fitted distribution parameters
        dist = getattr(scipy.stats, distribution)
        param = dist.fit(y_std)
        print("{}\n{}\n".format(dist, param))

        # Get expected counts in percentile bins
        # cdf of fitted sistrinution across bins
        cdf_fitted = dist.cdf(percentile_cutoffs, *param)
        expected_frequency = []
        for bin in range(len(percentile_bins)-1):
            expected_cdf_area = cdf_fitted[bin+1] - cdf_fitted[bin]
            expected_frequency.append(expected_cdf_area)

        # Chi-square Statistics
        expected_frequency = np.array(expected_frequency) * size
        cum_expected_frequency = np.cumsum(expected_frequency)
        ss = round(sum(((cum_expected_frequency - cum_observed_frequency)
                        ** 2) / cum_observed_frequency), 0)
        chi_square_statistics.append(ss)

    # Sort by minimum ch-square statistics
    results = pd.DataFrame()
    results['Distribution'] = dist_names
    results['chi_square'] = chi_square_statistics
    results.sort_values(['chi_square'], inplace=True)

    print('\nDistributions listed by Betterment of fit:')
    print('............................................')
    print(results.to_json(orient='records'))
    return results.to_json(orient='records')


@app.route('/getResult', methods=['POST'])
def getResults():
    column = request.json['column']
    dists = request.json['dists']
    try:
        global df
        results = fit_distribution(df, column, dists, 0.99, 0.01)
        return {'result': True, 'tableResult': results}
    except Exception as e:
        print(f"Exception: {e}")
        return {'result': False}
